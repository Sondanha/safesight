import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "위도/경도 누락" });
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
    console.log("Kakao API 요청 URL:", url);

    const kakaoRes = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });

    if (!kakaoRes.ok) {
      console.error("카카오 응답 실패 상태코드:", kakaoRes.status);
      return res
        .status(kakaoRes.status)
        .json({ error: "카카오 API 응답 오류" });
    }

    const data = await kakaoRes.json();
    console.log("Kakao 응답:", data);

    if (!data.documents || data.documents.length === 0) {
      return res.status(404).json({ error: "지역 정보를 찾을 수 없습니다." });
    }

    res.json(data);
  } catch (err) {
    console.error("Kakao API 요청 중 오류:", err);
    res
      .status(500)
      .json({ error: "카카오 API 요청 실패", detail: err.message });
  }
});

export default router;
