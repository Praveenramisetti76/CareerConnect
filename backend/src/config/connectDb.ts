import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { catchAndWrap } from "../utils/catchAndWrap";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI)
    throw new AppError(
      "mongoURI is not defined in env. variables or spelled wrong.",
      500
    );

  const conn = await catchAndWrap(
    () => mongoose.connect(mongoURI),
    "Failed to connected to MongoDB",
    500
  );
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
