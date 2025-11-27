const pwAuth = /^[\w!@#$%^&*()]{8,}$/;
const hasKorean = /[ㄱ-ㅎ가-힣]/;
const emailAuth = /^\S+@\S+\.\S+$/;

const url = "http://127.0.0.1:8080/user/";

const signUpBtn = document.getElementById("signUpBtn");
if (signUpBtn) {
    // 회원가입
    signUpBtn.addEventListener("click", async () => {
        const userid = document.getElementById("userId").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const payload = {
            userid,
            password,
            name,
            email,
        };

        const response = await fetch(url + "signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(payload),
        });

        const resJson = await response.json();

        if (resJson.message) {
            alert(resJson.message);
            return;
        } else {
            alert("회원가입 성공!");
            localStorage.setItem("token", resJson.token);
            localStorage.setItem("userIdx", resJson.userIdx);
            location.href = "/user-ui/login.html";
        }
    });
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    // 로그인 버튼 클릭 이벤트
    loginBtn.addEventListener("click", async () => {
        try {
            const id = document.getElementById("userId").value;
            const pw = document.getElementById("password").value;

            if (hasKorean.test(id)) {
                alert("아이디에 한글이 들어갈 수 없습니다.");
                return;
            }

            if (!pwAuth.test(pw)) {
                alert("비밀번호 형식이 올바르지 않습니다.");
                return;
            }

            const res = await fetch(url + "login", {
                method: "post",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({ userid: id, password: pw }),
            });

            const resJson = await res.json();

            if (resJson.message) {
                alert(resJson.message);
                return;
            }

            alert("로그인 성공!");
            localStorage.setItem("token", resJson.token);
            localStorage.setItem("userIdx", resJson.userIdx); // ← 추가
            location.href = "/post-ui/main.html";
        } catch (err) {
            console.error(err);
        }
    });
}
