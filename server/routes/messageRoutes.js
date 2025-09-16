import express from "express";

import { protect } from "../middlewares/auth.js";
import {
  imagemessageGenerator,
  textmessageController,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/text", protect, textmessageController);

messageRouter.post("/image", protect, imagemessageGenerator);

export default messageRouter;
