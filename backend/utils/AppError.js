export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
