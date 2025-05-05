fetch("../header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    document.getElementById("loginBtn").addEventListener("click", () => {
      window.location.href = "/login.html";
    });

    document.getElementById("signupBtn").addEventListener("click", () => {
      window.location.href = "/signup.html";
    });
  })
  .catch((err) => console.log("헤더 로딩 실패", err));
