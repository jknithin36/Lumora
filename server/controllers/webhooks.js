// src/controllers/webhooks.js
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
    // IMPORTANT: req.body is raw (Buffer) because of express.raw() on the route
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // ensure this matches your dashboard value
    );
  } catch (err) {
    console.error("Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // If you’re using Stripe Checkout, this is the simplest event to handle:
      case "checkout.session.completed": {
        const session = event.data.object; // Stripe.Checkout.Session
        const { transactionId, appId } = session?.metadata || {};

        if (appId !== "lumora") {
          return res.json({ received: true, message: "Ignored: invalid app" });
        }
        if (!transactionId) {
          return res.json({
            received: true,
            message: "Ignored: missing transactionId",
          });
        }

        // Only credit once
        const tx = await Transaction.findOne({
          _id: transactionId,
          isPaid: false,
        });
        if (!tx) {
          return res.json({
            received: true,
            message: "Transaction not found or already paid",
          });
        }

        await User.updateOne(
          { _id: tx.userId },
          { $inc: { credits: tx.credits } }
        );
        tx.isPaid = true;
        await tx.save();

        return res.json({ received: true });
      }

      // (Optional) If you also use payment intents without Checkout:
      // case "payment_intent.succeeded": {
      //   const pi = event.data.object;
      //   // If you need metadata, fetch the Checkout session tied to this PI:
      //   const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id });
      //   const session = sessions.data[0];
      //   const { transactionId, appId } = session?.metadata || {};
      //   // ...same crediting logic as above...
      //   return res.json({ received: true });
      // }

      default:
        console.log("Unhandled event type:", event.type);
        return res.json({ received: true });
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export default stripeWebhooks;
