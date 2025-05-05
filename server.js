import fetch from "node-fetch"; // ES Module 방식으로 import
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // .env 파일 로드

const app = express();
const PORT = 3001;

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.get("/api/region", async (req, res) => {
  const { lat, lon } = req.query;
  console.log("📍 API 요청 받은 좌표:", lat, lon);

  if (!lat || !lon) {
    return res.status(400).json({ error: "위도/경도 누락" });
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;

    const kakaoRes = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });

    if (!kakaoRes.ok) {
      const errorText = await kakaoRes.text();
      console.error("Kakao API 오류:", errorText);
      return res
        .status(500)
        .json({ error: "Kakao API 요청 실패", kakaoError: errorText });
    }

    // const data = await kakaoRes.json();
    // res.json(data);
    if (!data.documents || data.documents.length === 0) {
      return res.status(404).json({ error: "지역 정보를 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error("Kakao API 요청 중 오류:", err);
    res.status(500).json({ error: "서버 오류", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Kakao 프록시 서버 실행: http://localhost:${PORT}`);
});
