import { toXY } from "./grid-util.js";

document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
});

async function loadWeather() {
  const container = document.getElementById("weather-widget");
  if (!container) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(latitude, longitude, container);
    },
    () => {
      console.warn("위치 권한 거부됨 → 서울로 대체");
      fetchWeather(37.5665, 126.978, container);
    }
  );
}

async function fetchWeather(lat, lon, container) {
  const { nx, ny } = toXY(lat, lon);
  const baseDate = getBaseDate();
  const baseTime = getBaseTime();

  try {
    const res = await fetch(
      `/api/weather?nx=${nx}&ny=${ny}&baseDate=${baseDate}&baseTime=${baseTime}`
    );
    if (!res.ok) throw new Error("날씨 API 요청 실패");

    const json = await res.json();
    const items = json?.response?.body?.items?.item ?? [];

    let sky = "",
      pty = "0",
      t1h = 0;
    items.forEach(({ category, obsrValue }) => {
      if (category === "SKY") sky = obsrValue;
      if (category === "PTY") pty = obsrValue;
      if (category === "T1H") t1h = obsrValue;
    });

    const { icon, label } = getWeatherStatus(sky, pty, t1h);
    container.innerHTML = `<div class="weather-now">📍 현재 날씨: ${icon} ${label}</div>`;
  } catch (err) {
    console.error("날씨 위젯 오류:", err);
    container.innerText = "❗ 날씨 로딩 실패";
  }
}

function getWeatherStatus(sky, pty, temp) {
  if (pty !== "0") {
    return (
      {
        1: { icon: "🌧️", label: "비" },
        2: { icon: "🌨️", label: "비/눈" },
        3: { icon: "❄️", label: "눈" },
        4: { icon: "⛈️", label: "소나기" },
      }[pty] || { icon: "🌦️", label: "강수" }
    );
  }

  return (
    {
      1: { icon: "☀️", label: "맑음" },
      3: { icon: "⛅", label: "구름 많음" },
      4: { icon: "☁️", label: "흐림" },
    }[sky] || { icon: "🌡️", label: `${temp}℃` }
  );
}

function getBaseDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10).replace(/-/g, "");
}

function getBaseTime() {
  const now = new Date();
  now.setHours(now.getHours() - 1);
  return `${String(now.getHours()).padStart(2, "0")}00`;
}
