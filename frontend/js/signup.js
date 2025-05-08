document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signup-button");
  const selectBiz = document.querySelector(".selectBiz");
  const selectNomal = document.querySelector(".selectNomal");
  const displayBizNum = document.querySelector(".display__bizNum");

  // 회원가입 유형 선택
  selectBiz?.addEventListener("click", () => {
    displayBizNum.style.display = "block";
    selectBiz.classList.add("active");
    selectNomal.classList.remove("active");
  });

  selectNomal?.addEventListener("click", () => {
    displayBizNum.style.display = "none";
    selectNomal.classList.add("active");
    selectBiz.classList.remove("active");
  });

  // 아이디 중복 확인
  const checkBtn = document.getElementById("check-userid-btn");
  const checkMsg = document.getElementById("check-userid-msg");
  const useridInput = document.getElementById("signup-userid");
  let isUserIdChecked = false;

  checkBtn?.addEventListener("click", () => {
    const userid = useridInput?.value.trim();

    if (!userid || userid.length < 4) {
      checkMsg.textContent = "아이디는 4자 이상 입력하세요.";
      checkMsg.style.color = "red";
      isUserIdChecked = false;
      return;
    }

    fetch(`/auth/check-id?userid=${encodeURIComponent(userid)}`)
      .then((res) => res.json())
      .then((data) => {
        checkMsg.textContent = data.message;
        if (data.available) {
          checkMsg.style.color = "green";
          isUserIdChecked = true;
        } else {
          checkMsg.style.color = "red";
          isUserIdChecked = false;
        }
      })
      .catch(() => {
        checkMsg.textContent = "서버 오류";
        checkMsg.style.color = "red";
        isUserIdChecked = false;
      });
  });

  // 아이디 입력 시 중복 체크 무효화
  useridInput?.addEventListener("input", () => {
    isUserIdChecked = false;
    checkMsg.textContent = "다시 중복 확인이 필요합니다.";
    checkMsg.style.color = "gray";
  });

  // 회원가입 유효성 검사 및 제출
  signupBtn?.addEventListener("click", function (e) {
    e.preventDefault(); // 기본 제출 방지

    const userid = useridInput?.value.trim();
    const password = document.getElementById("signup-password")?.value;
    const verifyPassword = document.getElementById(
      "signup-verifyPassword"
    )?.value;
    const name = document.getElementById("signup-name")?.value.trim();
    const phone = document.getElementById("signup-phoneNumber")?.value.trim();
    const bizNum = document.getElementById("bizNum")?.value.trim();
    const isBiz = selectBiz?.classList.contains("active");

    if (!userid || userid.length < 4) {
      alert("아이디는 4자 이상 입력하세요.");
      return;
    }

    if (!isUserIdChecked) {
      alert("아이디 중복 확인을 먼저 해주세요.");
      return;
    }

    const pwValid = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
    if (!pwValid) {
      alert("비밀번호는 8자 이상이며, 특수문자를 포함해야 합니다.");
      return;
    }

    if (password !== verifyPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!name) {
      alert("이름을 입력하세요.");
      return;
    }

    const phoneValid = /^\d{11}$/.test(phone);
    if (!phoneValid) {
      alert("휴대폰 번호는 하이픈 없이 11자리 숫자여야 합니다.");
      return;
    }

    if (isBiz && (!bizNum || !/^\d{11}$/.test(bizNum))) {
      alert("사업장 관리번호는 11자리 숫자로 입력해야 합니다.");
      return;
    }

    // 모든 조건 통과 → form 제출
    e.target.closest("form").submit();
  });
});
