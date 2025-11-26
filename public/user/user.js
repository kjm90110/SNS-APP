const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");

// 영대소문자, 숫자, 특수문자 포함 8자 이상
// 공백 들어가면 안됨
// 아이디에 한글이 포함되지 않아야 함
const pwAuth = /^[\w!@#$%^&*()]{8,}$/;
const hasKorean = /[ㄱ-ㅎ가-힣]/;
const emailAuth = /^\S+@\S+\.\S+$/;

// 회원가입
signUpBtn.addEventListener('click', async () => {
    const userId = document.getElementById('userId');
    const password = document.getElementById('password');
    const name = document.getElementById('name');
    const email = document.getElementById('email');

    const url = 'http://127.0.0.1:8080/user/';
    const payload = {
        userId,
        password,
        name,
        email
    }

    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=utr-8'
        },
        body: JSON.stringify(payload)
    });

    const resJson = await response.json();
    

});

// 로그인 버튼 클릭 이벤트
loginBtn.addEventListener("click", () => {
    const id = document.getElementById("userId").value;
    const pw = document.getElementById("password").value;

    console.log(id);
    console.log(pw);

    const idTest = hasKorean.test(id); // id 형식 검사

    // password는 input type이 password이기 때문에 한글 입력이 안됨
    const pwTest = pwAuth.test(pw); // pw 형식 검사

    if (!idTest && !pwTest) {
        alert("아이디 또는 비밀번호를 확인해 주세요.");
        return;
    }

    alert("로그인 성공!");
    return;
});

signUpBtn.addEventListener("click", () => {});
