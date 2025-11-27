let myIdx;

window.onload = () => {
    myIdx = parseInt(localStorage.getItem("userIdx"), 10) || 0;
    console.log("myIdx:", myIdx);
    requestAllPosts();
    requestMyPosts();
};

// 로그인 유저 idx (number로 변환)
console.log("myIdx:", myIdx);

// 전체 게시물 조회(최근순)
async function requestAllPosts() {
    try {
        const res = await fetch("/post/", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });
        const data = await res.json();

        const recentList = document.querySelector(".recent-list");
        recentList.innerHTML = "";

        console.log("전체 게시물:", data.posts);

        data.posts.forEach((post) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerText = post.title;
            li.addEventListener("click", () => showPostDetail(post));
            recentList.appendChild(li);
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// 내가 올린 게시물 조회
async function requestMyPosts() {
    if (!myIdx) {
        console.log("회원 idx 정보가 없음");
        return;
    }

    try {
        const res = await fetch(`/post/user/${myIdx}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json;charset=utf-8",
            },
        });
        const data = await res.json();
        console.log("내 게시물:", data);

        const myPostList = document.querySelector(".my-post-list");
        myPostList.innerHTML = "";

        if (!data.posts || !Array.isArray(data.posts)) {
            console.log("posts가 배열이 아님");
            return;
        }

        data.posts.forEach((post) => {
            const li = document.createElement("li");
            li.classList.add(
                "list-group-item",
                "d-flex",
                "justify-content-between",
                "align-items-center"
            );

            const span = document.createElement("span");
            span.innerText = post.title;
            li.appendChild(span);

            // 삭제 버튼
            const delBtn = document.createElement("button");
            delBtn.classList.add("btn", "btn-danger", "btn-sm");
            delBtn.innerText = "삭제";
            delBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                await fetch(`/post/${post.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                });
                await requestMyPosts();
                await requestAllPosts();
            });
            li.appendChild(delBtn);

            li.addEventListener("click", () => showPostDetail(post));
            myPostList.appendChild(li);
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// 게시물 상세보기 모달
async function showPostDetail(post) {
    document.getElementById("detailTitle").innerText = post.title;
    document.getElementById("detailContent").innerText = post.content;
    document.getElementById("detailId").value = post.id;

    const detailModal = new bootstrap.Modal(
        document.getElementById("postDetailModal")
    );

    const reqOnePost = await fetch(`/post/${post.id}`, {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    });

    const resPostJson = await reqOnePost.json();

    const resOneUser = await fetch(`/user/${resPostJson.useridx}`);
    const resUserJson = await resOneUser.json();

    const userIdAboutThisPost = resUserJson.userid;
    const createdAt = resPostJson.createdAt;

    const d = new Date(createdAt);
    const pad = (t) => t.toString().padStart(2, "0");

    const formatted =
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const writeInfo = document.getElementById("writeInfo");
    writeInfo.innerText = `${userIdAboutThisPost} / ${formatted}`;

    // response로 오는 post의 useridx가 string이기 때문에
    // Number로 형변환하여 비교
    if (Number(post.useridx) !== myIdx) {
        modifyBtn.style.display = "none";
    } else {
        modifyBtn.style.display = "block"; // 내가 작성한 포스트 상세에만 수정 버튼이 보이도록
    }
    detailModal.show();
}

// 게시물 등록 + 수정 처리
document.getElementById("savePostBtn").addEventListener("click", async () => {
    const id = document.getElementById("modalPostId").value;
    const title = document.getElementById("postTitleInput").value;
    const content = document.getElementById("postContentInput").value;

    if (!title || !content) return alert("제목과 내용을 입력하세요.");

    const method = id ? "PUT" : "POST";
    const url = id ? `/post/${id}` : "/post";

    try {
        const res = await fetch(url, {
            method,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
            alert(id ? "수정되었습니다." : "등록되었습니다.");
            const modalEl = document.getElementById("postModal");
            const modal =
                bootstrap.Modal.getInstance(modalEl) ||
                new bootstrap.Modal(modalEl);
            modal.hide();
            requestAllPosts();
            requestMyPosts();
        } else {
            alert("요청 실패");
        }
    } catch (err) {
        console.error(err);
    }
});

document.getElementById("showRegistPostForm").addEventListener("click", () => {
    document.getElementById("modalPostId").value = "";
    document.getElementById("postTitleInput").value = "";
    document.getElementById("postContentInput").value = "";

    document.getElementById("modalTitle").innerText = "게시물 작성";
    document.getElementById("savePostBtn").innerText = "등록";

    // 3. 모달 띄우기
    const modal = new bootstrap.Modal(document.getElementById("postModal"));
    modal.show();
});

document.getElementById("modifyBtn").addEventListener("click", () => {
    // 현재 상세 모달 닫기 (겹치지 않게)
    const detailModal = bootstrap.Modal.getInstance(
        document.getElementById("postDetailModal")
    );
    detailModal.hide();

    // 현재 보고 있던 데이터 가져오기
    const id = document.getElementById("detailId").value;
    const title = document.getElementById("detailTitle").innerText;
    const content = document.getElementById("detailContent").innerText;

    // 작성/수정 모달에 데이터 채워 넣기
    document.getElementById("modalPostId").value = id;
    document.getElementById("postTitleInput").value = title;
    document.getElementById("postContentInput").value = content;

    // 텍스트를 '수정' 모드로 변경
    document.getElementById("modalTitle").innerText = "게시물 수정";
    document.getElementById("savePostBtn").innerText = "수정하기";

    // 모달 띄우기
    const postModal = new bootstrap.Modal(document.getElementById("postModal"));
    postModal.show();
});
