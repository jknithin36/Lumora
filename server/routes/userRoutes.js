import express from "express";
import {
  getUser,
  loginUser,
  registeruser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { getPublishedImages } from "../controllers/messageController.js";

const userRouter = express.Router();

userRouter.post("/register", registeruser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUser);
userRouter.get("/publishedImages", protect, getPublishedImages);

export default userRouter;
