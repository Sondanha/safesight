document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

const SAFETY_GUIDELINES = {
  떨어짐: "떨어짐 방지를 위해 안전벨트 착용 필수",
  끼임: "기계 작동 전 전원 차단 및 잠금 조치",
  화재: "인화성 물질 주변에서 불꽃 사용 금지",
  넘어짐: "작업장 바닥 정리정돈 및 미끄럼 방지 조치",
  깔림: "작업 전 위험물 적재상태와 지지물 확인 필수",
  부딪힘: "작업 반경 내 접근 금지 및 시야 확보 유지",
  맞음: "안전모 착용 및 상부 작업 시 낙하물 확인",
  무너짐: "가시설 및 흙막이 지지 상태 사전 점검",
  감전: "전기 작업 전 차단 확인 및 절연 장비 착용",
  폭발: "밀폐공간 내 가스 농도 측정 및 환기 필수",
  쓰러짐: "중량물이나 구조물 주변 작업 시 지지대 설치 및 고정 확인",
};

async function loadNews() {
  const widget = document.getElementById("news-widget");
  const guidelineWidget = document.getElementById("safety-guideline-widget");

  try {
    const res = await fetch("/api/news?numOfRows=1&pageNo=1");
    if (!res.ok) throw new Error("뉴스 API 요청 실패");

    const json = await res.json();
    const items = json?.body?.items?.item ?? [];

    if (!items.length) {
      widget.innerText = "뉴스가 없습니다.";
      guidelineWidget.innerText = "";
      return;
    }

    const latest = items[0];
    const match = latest.keyword?.match(/^\[(.+?)\]\s*(.+)$/);
    const location = match?.[1] ?? "";
    const description = match?.[2] ?? latest.keyword;

    widget.innerHTML = `
    <div class="news-widget-title">[안전 사고 뉴스]</div>
      <div class="news-location">${location}</div>
      <div class="news-description">${description}</div>
    `;

    const guideline = getSafetyGuidelineFromDescription(description);
    renderGuidelineTo(guidelineWidget, guideline);
  } catch (err) {
    console.error("뉴스 위젯 오류:", err);
    widget.innerText = "❗ 뉴스 로드 실패";
    guidelineWidget.innerText = "";
  }
}

function getSafetyGuidelineFromDescription(description) {
  const lastWord = description
    .trim()
    .split(" ")
    .pop()
    .replace(/[^\w가-힣]/g, "");
  return SAFETY_GUIDELINES[lastWord];
}

function renderGuidelineTo(container, guideline) {
  if (!container || !guideline) return;

  container.innerHTML = `
    <div class="news-widget-title">[오늘의 안전 수칙]</div>
    <div class="news-guideline">${guideline}</div>
  `;
}
