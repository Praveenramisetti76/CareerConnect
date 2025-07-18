import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const role =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden: Access Denied", 403);
    }

    next();
  };
