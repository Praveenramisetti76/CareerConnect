import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";
import { sendPasswordReset } from "../utils/sendEmail.js";
import {
  signUpSchema,
  logInSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema,
} from "../zodSchema/auth.validation.js";

const registerUser = async (req, res) => {
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }

  const { name, email, password, role } = result.data;

  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) throw new AppError("User already exists", 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });

  const token = signToken({ id: user._id, role: user.role });

  res.status(201).json({
    message: "Registration successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const loginUser = async (req, res) => {
  const result = logInSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError("Invalid Input", 400);
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = signToken({ id: user._id, role: user.role });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is not found", 400);

  const user = await catchAndWrap(
    () => User.findOne({ email }),
    "User not found",
    404
  );

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetURL = `http://localhost:5000/reset-password/${token}/${user._id}`;
  await sendPasswordReset(email, resetURL);

  res.status(200).json({ message: "Password reset link sent successfully" });
};

const resetPassword = async (req, res) => {
  const paramsResult = resetPasswordParamsSchema.safeParse(req.params);
  const bodyResult = resetPasswordBodySchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      success: false,
      errors: {
        params: paramsResult.error?.flatten(),
        body: bodyResult.error?.flatten(),
      },
    });
  }

  const { token, id } = paramsResult.data;
  const { password } = bodyResult.data;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await catchAndWrap(
    () =>
      User.findOne({
        _id: id,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      }),
    "User not found",
    404
  );

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password was reset successfully." });
};

export { registerUser, loginUser, forgotPassword, resetPassword };
