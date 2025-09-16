// controllers/webhooks.js
import Stripe from "stripe";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // req.body must be raw Buffer (see route wiring below)
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // make sure this matches your Stripe dashboard / CLI secret
    );
  } catch (err) {
    console.error("Webhook verify failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { transactionId, appId } = session?.metadata || {};

        console.log("checkout.session.completed", {
          transactionId,
          appId,
          payment_status: session.payment_status,
        });

        if (appId !== "lumora")
          return res.json({ received: true, message: "ignored appId" });
        if (!transactionId)
          return res.json({ received: true, message: "missing transactionId" });
        if (session.payment_status !== "paid")
          return res.json({ received: true, message: "not paid yet" });

        // flip isPaid once
        const tx = await Transaction.findOneAndUpdate(
          { _id: transactionId, isPaid: false },
          {
            $set: {
              isPaid: true,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent || null,
            },
          },
          { new: true }
        );

        if (!tx) {
          // already handled or not found — acknowledge anyway
          return res.json({
            received: true,
            message: "already paid or not found",
          });
        }

        await User.updateOne(
          { _id: tx.userId },
          { $inc: { credits: tx.credits } }
        );

        return res.json({ received: true });
      }

      default:
        console.log("Unhandled event:", event.type);
        return res.json({ received: true });
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export default stripeWebhooks;
