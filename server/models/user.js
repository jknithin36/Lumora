import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, requred: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 20 },
});

userSchema.pre("save", async function name(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = mongoose.model("User", userSchema);

export default User;
