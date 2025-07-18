import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error";
import connectDB from "./config/connectDb";
import helmet from "helmet";
import authRoutes from "./routes/user/auth.routes";
const app = express();

dotenv.config();

app.use(helmet());
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
