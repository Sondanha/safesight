document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("post-form");
  const textarea = document.getElementById("post-content");
  const list = document.getElementById("post-list");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // 글 작성
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!token) return alert("로그인 후 작성 가능합니다.");

    const content = textarea.value.trim();
    if (!content) return;

    const res = await fetch("/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      textarea.value = "";
      loadPosts();
    } else {
      alert("글 작성 실패");
    }
  });

  // 글 목록 조회
  async function loadPosts() {
    const res = await fetch("/post");
    const posts = await res.json();

    list.innerHTML = posts
      .map((post) => {
        const isMine = user && user.userid === post.userid;
        return `
        <div class="post" data-id="${post._id}">
          <div class="post-author">👤 ${post.userid}</div>
          <div class="post-content">${post.content}</div>
          <div class="post-time">${new Date(
            post.createdAt
          ).toLocaleString()}</div>
          ${
            isMine
              ? `<div class="post-actions">
                  <button class="edit-post">수정</button>
                  <button class="delete-post">삭제</button>
                 </div>`
              : ""
          }
        </div>
      `;
      })
      .join("");
  }

  // 삭제/수정 이벤트
  list.addEventListener("click", async (e) => {
    const postDiv = e.target.closest(".post");
    const postId = postDiv?.dataset.id;

    if (e.target.classList.contains("delete-post")) {
      if (!confirm("정말 삭제할까요?")) return;

      const res = await fetch(`/post/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("삭제 완료");
        loadPosts();
      } else {
        alert("삭제 실패");
      }
    }

    if (e.target.classList.contains("edit-post")) {
      const contentEl = postDiv.querySelector(".post-content");
      const currentContent = contentEl.textContent;
      const newContent = prompt("수정할 내용을 입력하세요:", currentContent);
      if (!newContent || newContent === currentContent) return;

      const res = await fetch(`/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (res.ok) {
        alert("수정 완료");
        loadPosts();
      } else {
        alert("수정 실패");
      }
    }
  });

  loadPosts();
});
