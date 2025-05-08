fetch("/pages/footer.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("footer-placeholder").innerHTML = html;
  })
  .catch((err) => console.log("헤더 로딩 실패", err));
