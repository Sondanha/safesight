// backend/routes/news.mjs
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const API_KEY = process.env.NEWS_API_KEY;

router.get("/", async (req, res) => {
  const { numOfRows = 10, pageNo = 1 } = req.query;
  const url = `https://apis.data.go.kr/B552468/news_api01/getNews_api01?serviceKey=${API_KEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;

  try {
    const result = await fetch(url);
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "뉴스 API 요청 실패" });
  }
});

export default router;
