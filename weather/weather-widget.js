// ✅ Kakao 지역명 요청 (프록시 서버 사용)
async function getRegionNameViaProxy(lat, lon) {
  try {
    const res = await fetch(
      `http://localhost:3001/api/region?lat=${lat}&lon=${lon}`
    );
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

// ✅ 날씨 상태 해석
function getWeatherStatus(sky, pty, temp) {
  if (pty !== "0") {
    switch (pty) {
      case "1":
        return { icon: "🌧️", label: "비" };
      case "2":
        return { icon: "🌨️", label: "비 또는 눈" };
      case "3":
        return { icon: "❄️", label: "눈" };
      case "4":
        return { icon: "⛈️", label: "소나기" };
      default:
        return { icon: "🌦️", label: "강수" };
    }
  }

  if (temp >= 33) return { icon: "🔥", label: "폭염" };
  if (temp <= 0) return { icon: "🥶", label: "한파" };

  if (!sky) return { icon: "🌡️", label: `${temp}℃` };

  switch (sky) {
    case "1":
      return { icon: "☀️", label: "맑음" };
    case "3":
      return { icon: "⛅", label: "구름 많음" };
    case "4":
      return { icon: "☁️", label: "흐림" };
    default:
      return { icon: "❓", label: "알 수 없음" };
  }
}

// ✅ 날짜, 시간 계산
function getBaseDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10).replace(/-/g, "");
}

function getBaseTime() {
  const now = new Date();
  now.setHours(now.getHours() - 1); // 1시간 전 기준
  const hour = String(now.getHours()).padStart(2, "0");
  return `${hour}00`;
}

// ✅ 위도/경도 → 기상청 격자 변환 (간단 구현 or 별도 util에서 import)
function toXY(lat, lon) {
  // 서울시청 기준 fallback용 단순값
  return { nx: 60, ny: 127 };
}

// ✅ 날씨 불러와서 출력
async function fetchAndRenderWeather(lat, lon, container) {
  const { nx, ny } = toXY(lat, lon);
  const baseDate = getBaseDate();
  const baseTime = getBaseTime();

  const API_KEY =
    "K4jlOAJiUWlRs%2FQ4nZlkb4exnDFFrlX1JSDX48nZ3kkwF8Y%2FzzDccjSbqJPSiu9F7qBnOwAE6gKBxxZi516QPQ%3D%3D";
  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    const items = json.response.body.items.item;
    if (!items || items.length === 0) {
      container.innerText = "❗ 날씨 데이터를 불러오지 못했습니다.";
      return;
    }

    let sky = "",
      pty = "0",
      t1h = 0;
    items.forEach(({ category, obsrValue }) => {
      if (category === "SKY") sky = obsrValue;
      if (category === "PTY") pty = obsrValue;
      if (category === "T1H") t1h = Number(obsrValue);
    });

    const { icon, label } = getWeatherStatus(sky, pty, t1h);
    const regionName = await getRegionNameViaProxy(lat, lon);

    container.innerHTML = `
        <div class="weather-regionName">📍 ${regionName}</div>
        <div class="weather-now">${icon} 현재 날씨: ${label}</div>
      `;
  } catch (err) {
    console.error("날씨 정보 오류:", err);
    container.innerText = "❗ 날씨 정보를 불러오지 못했습니다.";
  }
}

// 시작 함수
async function loadWeather() {
  const container = document.getElementById("weather-widget");
  if (!container) return;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      await fetchAndRenderWeather(latitude, longitude, container);
    },
    async () => {
      console.warn("위치 권한 거부됨 → 서울로 fallback");
      await fetchAndRenderWeather(37.5665, 126.978, container);
    }
  );
}

loadWeather();
