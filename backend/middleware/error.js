import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error("unhandled error:", err);
  let statusCode = 500;
  let message = "Something went wrong! Please try again.";

  // Custom App errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed!";

    return res.status(statusCode).json({
      success: false,
      message,
      errors: (err.errors || []).map((e) => ({
        path: Array.isArray(e.path) ? e.path.join(".") : "unknown",
        message: e.message || "Invalid input",
      })),
    });
  }

  // Any other error
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
