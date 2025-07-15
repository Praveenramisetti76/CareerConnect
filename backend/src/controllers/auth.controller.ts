import { Request, Response } from "express";
import { signToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { signUpSchema, logInSchema } from "../zodSchemas/auth.schema";

const registerUser = async (req: Request, res: Response) => {
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError("Invalid Input", 400);
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

const loginUser = async (req: Request, res: Response) => {
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

const forgotPassword = async (req: Request, res: Response) => {

}

const resetPassword = async (req: Request, res: Response) => {

}

export { registerUser, loginUser, forgotPassword, resetPassword };
