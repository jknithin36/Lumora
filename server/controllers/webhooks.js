import Stripe from "stripe";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];

        const { transactionId, appId } = session.metadata;

        if (appId === "lumora") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          await User.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          transaction.isPaid = true;

          await transaction.save();
        } else {
          return res.json({
            received: true,
            message: "Ingorned Event: Invalid App",
          });
        }
        break;
      }

      default:
        console.log("unhandled event type", event.type);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export default stripeWebhooks;
