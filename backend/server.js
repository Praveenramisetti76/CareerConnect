import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.js";
import connectDB from "./config/connectDB.js";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import connectionRoutes from "./routes/connections.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import articleRoutes from "./routes/article.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/article", articleRoutes);

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
