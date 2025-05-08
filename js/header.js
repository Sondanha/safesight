fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    const loginPage = location.pathname.includes("login");
    const signupPage = location.pathname.includes("signup");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const homeBtn = document.querySelector(".home__btn");
    const main = document.querySelector(".main");

    if ((loginPage || signupPage) && loginBtn && signupBtn && homeBtn) {
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";

      homeBtn.style.display = "inline-block";
    }
    if (signupPage && main) {
      main.style.margin = "0";
    }

    homeBtn?.addEventListener("click", () => {
      window.location.href = "/index.html";
    });

    loginBtn?.addEventListener("click", () => {
      window.location.href = "/login.html";
    });

    signupBtn?.addEventListener("click", () => {
      window.location.href = "/signup.html";
    });
  })
  .catch((err) => console.log("헤더 로딩 실패", err));
