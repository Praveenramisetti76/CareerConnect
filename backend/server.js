import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.js";
import connectDB from "./config/connectDB.js";
import helmet from "helmet";
import authRoutes from "./routes/user/auth.routes.js";
import profileRoutes from "./routes/user/profile.routes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log(`Server is up Baby! Running on ${PORT}`);
  });
} catch (err) {
  console.error(`Server failed to start ${err}`);
  process.exit(1);
}
