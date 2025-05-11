document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.getElementById("community-preview");

  fetch("/post")
    .then((res) => res.json())
    .then((posts) => {
      const previewPosts = posts.slice(0, 3); // 최신 글 3개
      previewContainer.innerHTML = previewPosts
        .map(
          (post) => `
          <div class="preview-post">
            <div class="preview-author">👤 ${post.userid}</div>
            <div class="preview-content">${post.content}</div>
            <div class="preview-time">${new Date(
              post.createdAt
            ).toLocaleString()}</div>
          </div>
        `
        )
        .join("");
    })
    .catch((err) => {
      previewContainer.innerText = "❗ 커뮤니티 글을 불러오지 못했습니다.";
      console.error("커뮤니티 미리보기 오류:", err);
    });
});
