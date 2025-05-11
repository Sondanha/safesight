document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-button");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const userid = document.getElementById("login-userid")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    if (!userid || !password) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        alert(data.message || "로그인 실패");
        return;
      }

      // 토큰과 유저 정보 저장
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("로그인 성공!");
      location.href = "/";
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("서버 오류로 로그인에 실패했습니다.");
    }
  });
});
