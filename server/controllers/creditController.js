import Transaction from "../models/transaction.js";
import Stripe from "stripe";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

// api to get plans
export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// api controller for purchasing
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find((p) => p._id === planId);
    if (!plan) {
      return res.json({ success: false, message: "Invalid Plan" });
    }

    // create new Transaction (fixed field names)
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price, // was "amaount"
      credits: plan.credits,
      isPaid: false,
    });

    // figure out origin safely
    const origin =
      req.headers.origin || process.env.APP_ORIGIN || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(plan.price * 100),
            product_data: { name: plan.name },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      // keep these EXACT — webhook reads metadata.transactionId + appId
      metadata: {
        transactionId: transaction._id.toString(),
        appId: "lumora",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return res.json({
      success: true, // was "sucess"
      url: session.url,
      sessionId: session.id, // handy for debugging
      transactionId: transaction._id,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
