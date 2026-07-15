import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Silent Earth API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Silent Earth API listening on port ${PORT}`);
});
