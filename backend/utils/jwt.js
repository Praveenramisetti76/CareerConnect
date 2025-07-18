import jwt from "jsonwebtoken";

export const signToken = (payload) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};
