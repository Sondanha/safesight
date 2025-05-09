import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./backend/routes/auth.mjs";
import postRouter from "./backend/routes/post.mjs";

import newsRouter from "./backend/routes/news.mjs";
import regionRouter from "./backend/routes/region.mjs";
import weatherRouter from "./backend/routes/weather.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "frontend")));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.use("/api/news", newsRouter);
app.use("/api/region", regionRouter);
app.use("/api/weather", weatherRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/index.html"));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
