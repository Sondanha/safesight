import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routes/auth.mjs";
import postRouter from "./routes/post.mjs";

import newsRouter from "./routes/news.mjs";
import regionRouter from "./routes/region.mjs";
import weatherRouter from "./routes/weather.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.use("/api/news", newsRouter);
app.use("/api/region", regionRouter);
app.use("/api/weather", weatherRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// (선택) 테스트용 라우트 - 필요 시만 유지
/*
import User from "./models/user.js";
app.get("/create-test-user", async (req, res) => {
  try {
    const user = await User.create({ userid: "testuser", password: "1234" });
    res.json({ message: "유저 생성 완료", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
