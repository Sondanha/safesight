import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const { nx, ny, baseDate, baseTime } = req.query;
  if (!nx || !ny || !baseDate || !baseTime) {
    return res.status(400).json({ error: "날씨 요청 파라미터 누락" });
  }

  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "날씨 API 오류", detail: err.message });
  }
});

export default router;
