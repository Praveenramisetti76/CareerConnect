import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong! Please try again.";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed!";

    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
