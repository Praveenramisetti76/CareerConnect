import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error";
const app = express();

dotenv.config();

app.use(express.json());

app.use(errorHandler);

export default app;
