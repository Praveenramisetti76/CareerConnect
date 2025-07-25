import mongoose from "mongoose";

const { Schema, model } = mongoose;

const pendingUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["candidate", "recruiter"], required: true },
    twoFactorTempSecret: { type: String, required: true }, // hashed OTP
    twoFactorOTPExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model("PendingUser", pendingUserSchema); 