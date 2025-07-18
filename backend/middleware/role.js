// middleware/role.js
import { AppError } from "../utils/AppError.js";

export const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden: Access Denied", 403);
    }

    next();
  };
};
