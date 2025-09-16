// src/index.js (or server.js)
import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import stripeWebhooks from "./controllers/webhooks.js"; // <-- note the path & default import

const app = express();

await connectDB();

// Stripe webhook MUST receive the raw body and be mounted BEFORE express.json()
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

app.use(cors());
app.use(express.json()); // after the webhook

// routes
app.get("/", (req, res) => res.send("server is Live"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter); // keep singular if your routes expect it
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
