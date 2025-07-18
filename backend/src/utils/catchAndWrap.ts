import { AppError } from "./AppError";

export const catchAndWrap = async <T>(
  fn: () => Promise<T>,
  fallbackMessage: string,
  statusCode = 500
): Promise<T> => {
  try {
    return await fn();
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError(fallbackMessage, statusCode);
  }
};
