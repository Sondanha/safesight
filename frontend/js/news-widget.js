import {
  getSafetyGuidelineFromDescription,
  renderGuidelineTo,
} from "./safety-guideline-widget.js";

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

async function loadNews() {
  const widget = document.getElementById("news-widget");

  try {
    const res = await fetch("/api/news?numOfRows=1&pageNo=1");
    if (!res.ok) throw new Error("뉴스 API 요청 실패");

    const json = await res.json();
    const items = json?.body?.items?.item ?? [];

    if (!items.length) {
      widget.innerText = "뉴스가 없습니다.";
      return;
    }

    const latest = items[0];
    const match = latest.keyword?.match(/^\[(.+?)\]\s*(.+)$/);
    const location = match?.[1] ?? "";
    const description = match?.[2] ?? latest.keyword;

    widget.innerHTML = `
      <div class="news-location">📰 ${location}</div>
      <div class="news-description">${description}</div>
    `;

    const guideline = getSafetyGuidelineFromDescription(description);
    renderGuidelineTo("safety-guideline-widget", guideline);
  } catch (err) {
    console.error("뉴스 위젯 오류:", err);
    widget.innerText = "❗ 뉴스 로드 실패";
  }
}
