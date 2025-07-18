import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import User from "../models/User.js";

export const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized: No token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new AppError("Unauthorized: User not found", 401);

    req.user = user; // Now req.user._id is valid
    next();
  } catch (err) {
    next(new AppError("Unauthorized: Invalid token", 401));
  }
};
