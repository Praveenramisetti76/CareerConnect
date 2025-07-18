import { AppError } from "./AppError.js";

export const catchAndWrap = async (fn, fallbackMessage, statusCode = 500) => {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AppError) throw err;

    console.error("Error caught in catchAndWrap:", err);

    throw new AppError(fallbackMessage, statusCode);
  }
};
