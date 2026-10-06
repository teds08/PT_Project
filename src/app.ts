import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import animeRoutes from "./routes/anime.routes";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Anime List Tracker API is running.",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/anime", animeRoutes);

app.use(errorMiddleware);

export default app;
