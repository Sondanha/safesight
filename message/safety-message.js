const safetyMessages = [
  "오늘도 무사히! 당신의 안전이 가장 소중합니다.",
  "작업 시작 전, 점검은 필수! 당신의 가족이 기다리고 있어요.",
  "안전모는 생명을 지키는 약속입니다. 오늘도 잊지 마세요.",
  "잠깐의 불편함보다 평생의 안전이 더 중요합니다.",
  "당신의 한 걸음, 한 움직임이 모두를 안전하게 합니다.",
  "서두르지 마세요. 안전은 언제나 여유에서 시작됩니다.",
  "정리정돈은 작은 실천이지만 큰 사고를 막습니다.",
  "피곤할 땐 잠시 쉬어가세요. 쉼도 안전의 일부입니다.",
  "보호장비는 옵션이 아니라 생명선입니다.",
  "당신이 지키는 안전, 모두의 내일을 밝힙니다.",
  "위험을 느꼈다면 멈추고 살펴보세요. 그 선택이 옳습니다.",
  "안전은 실천입니다. 오늘도 스스로 지켜주세요.",
  "사고 없는 하루, 당신 덕분입니다.",
  "작업 전, 서로의 상태를 한 번 더 확인해요.",
  "현장의 주인공은 당신입니다. 안전하게 빛나세요.",
];

let currentIndex = 0;

function rotateMessage() {
  const messageEl = document.getElementById("safetymessage-widget");
  if (!messageEl) return;

  messageEl.classList.add("fade-out");

  setTimeout(() => {
    messageEl.textContent = safetyMessages[currentIndex];
    currentIndex = (currentIndex + 1) % safetyMessages.length;

    messageEl.classList.remove("fade-out");
  }, 500);
}

rotateMessage();
// 20초마다 변경
setInterval(rotateMessage, 20000);
