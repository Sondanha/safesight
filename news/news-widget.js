const serviceKey =
  "K4jlOAJiUWlRs%2FQ4nZlkb4exnDFFrlX1JSDX48nZ3kkwF8Y%2FzzDccjSbqJPSiu9F7qBnOwAE6gKBxxZi516QPQ%3D%3D";
const numOfRows = 10;
const pageNo = 1;

function loadData() {
  const url = `https://apis.data.go.kr/B552468/news_api01/getNews_api01?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
      return res.json();
    })
    .then((json) => {
      console.log("API 응답:", json);
      const items = json?.body?.items?.item ?? [];
      renderLatestNewsTextOnly(items);
    })
    .catch((err) => {
      document.getElementById("news-widget").innerText =
        "에러 발생: " + err.message;
    });
}

import {
  getSafetyGuidelineFromDescription,
  renderGuidelineTo,
} from "/news/safety-guideline-widget.js";

function renderLatestNewsTextOnly(items) {
  const widget = document.getElementById("news-widget");

  if (!items.length) {
    widget.innerText = "데이터가 없습니다.";
    return;
  }

  const latest = items[0];

  // 예: "[4/26, 서울 금천구] 작업 중 사다리에서 떨어짐"
  const rawKeyword = latest.keyword || "";

  // 대괄호 안과 밖으로 나누기
  const match = rawKeyword.match(/^\[(.+?)\]\s*(.+)$/);

  let locationLine = "";
  let descriptionLine = "";

  if (match) {
    locationLine = match[1]; // 4/26, 서울 금천구
    descriptionLine = match[2]; // 작업 중 사다리에서 떨어짐
  } else {
    descriptionLine = rawKeyword;
  }

  widget.innerHTML = `
  <div class="news-location">${locationLine}</div>
  <div class="news-description">${descriptionLine}</div>
`;

  const guideline = getSafetyGuidelineFromDescription(descriptionLine);
  renderGuidelineTo("safety-guideline-widget", guideline);
}

loadData();
