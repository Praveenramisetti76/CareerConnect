import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

interface DecodedUserPayload {
  id: string;
  role: string;
}

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!
  ) as DecodedUserPayload;
  
  req.user = decoded;

  next();
};
