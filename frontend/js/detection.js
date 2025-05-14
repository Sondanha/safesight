const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const output = document.getElementById("output");
const taskSelect = document.getElementById("task");
const violationsList = document.getElementById("violationsList");

let stream = null;
let detectInterval = null;

navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
  stream = s;
  video.srcObject = stream;
});

document.getElementById("startBtn").addEventListener("click", () => {
  if (detectInterval) return; // 이미 감지 중이면 무시
  detectInterval = setInterval(sendFrame, 500); // 0.5초마다 감지
});

function sendFrame() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");
    formData.append("task", taskSelect.value);

    fetch("/detect", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // 감지된 이미지를 출력
        const imageBytes = new Uint8Array(
          data.image.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
        );
        const blob = new Blob([imageBytes], { type: "image/jpeg" });
        output.src = URL.createObjectURL(blob);

        // 미착용 리스트 업데이트
        violationsList.innerHTML = "";
        data.violations.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `Missing: ${item}`;
          violationsList.appendChild(li);
        });
      })
      .catch(console.error);
  }, "image/jpeg");
}

let db;

const request = indexedDB.open("MyNotesDB", 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  if (!db.objectStoreNames.contains("notes")) {
    db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function (e) {
  db = e.target.result;
  displayNotes();
};

request.onerror = function () {
  alert("IndexedDB 열기 실패");
};

function saveNote() {
  const input = document.getElementById("noteInput");
  const text = input.value.trim();
  if (!text) return;

  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.add({ text: text, created: new Date() });

  tx.oncomplete = function () {
    input.value = "";
    displayNotes();
  };
}

function displayNotes() {
  const list = document.getElementById("noteList");
  list.innerHTML = "";

  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");

  const request = store.openCursor(null, "prev");

  request.onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      const li = document.createElement("li");
      li.className = "note-item";

      li.innerHTML = `
          <div class="note-name">👷${cursor.value.text}</div>
          <div class="note-meta">
            <span class="approved-label">✅승인됨</span>
            <span class="created-date">${cursor.value.created.toLocaleString()}</span>
          </div>`;

      list.appendChild(li);
      cursor.continue();
    }
  };
}
document.getElementById("noteInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    saveNote();
  }
});
