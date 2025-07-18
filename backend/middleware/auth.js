import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

// Middleware: Authentication
export const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new AppError("Unauthorized: Invalid token", 401);
  }

  req.user = decoded; // Assumes the token contains { id, role }
  next();
};
