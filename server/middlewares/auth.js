// middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    // 1) Get token from Authorization header: "Bearer <jwt>"
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Missing or invalid Authorization header",
        });
    }
    const token = auth.slice(7).trim();

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support common payload shapes: { sub }, { id }, { _id }
    const userId = decoded.sub || decoded.id || decoded._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Token payload missing user id" });
    }

    // 3) Load user (lean + limited fields for speed)
    const user = await User.findById(userId)
      .select("_id name email role")
      .lean();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized: user not found" });
    }

    // 4) Attach and continue
    req.user = user;
    return next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token expired"
        : err.name === "JsonWebTokenError"
        ? "Invalid token"
        : err.message || "Unauthorized";
    return res.status(401).json({ success: false, message });
  }
};
