const selectBiz = document.querySelector(".selectBiz");
const selectNomal = document.querySelector(".selectNomal");
const displayBizNum = document.querySelector(".display__bizNum");

selectBiz.addEventListener("click", () => {
  displayBizNum.style.display = "block";
  selectBiz.classList.add("active");
  selectNomal.classList.remove("active");
});

selectNomal.addEventListener("click", () => {
  displayBizNum.style.display = "none";
  selectNomal.classList.add("active");
  selectBiz.classList.remove("active");
});
