fetch("/pages/header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const loginPage = location.pathname.includes("login");
    const signupPage = location.pathname.includes("signup");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const homeBtn = document.querySelector(".home__btn");
    const main = document.querySelector(".main");

    if ((loginPage || signupPage) && loginBtn && signupBtn && homeBtn) {
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      homeBtn.style.display = "inline-block";
    }

    fetch("/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.loggedIn) {
          loginBtn.style.display = "none";
          signupBtn.style.display = "none";
          logoutBtn.style.display = "inline-block";
          homeBtn.style.display = "inline-block";
        }
      })
      .catch(() => {
        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
      });

    homeBtn?.addEventListener("click", () => {
      window.location.href = "/pages/index.html";
    });
    loginBtn?.addEventListener("click", () => {
      window.location.href = "/pages/login.html";
    });
    signupBtn?.addEventListener("click", () => {
      window.location.href = "/pages/signup.html";
    });

    logoutBtn?.addEventListener("click", async () => {
      try {
        await fetch("/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("서버 로그아웃 실패", e);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("로그아웃 되었습니다.");

      window.location.href = "/index.html";
    });
  })
  .catch((err) => console.log("헤더 로딩 실패", err));
