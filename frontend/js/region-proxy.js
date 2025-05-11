const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://YOUR_DEPLOYED_DOMAIN";

export async function getRegionNameViaProxy(lat, lon) {
  try {
    const res = await fetch(`${BASE_URL}/api/region?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("지역명 요청 실패");

    const data = await res.json();
    const region = data.documents?.[0];

    return region
      ? `${region.region_1depth_name} ${region.region_2depth_name}`
      : "위치 정보 없음";
  } catch (err) {
    console.error("지역명 가져오기 오류:", err);
    return "지역 정보 오류";
  }
}
