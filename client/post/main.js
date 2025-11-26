document.getElementById("registPostBtn").addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("postModal"));
    modal.show();
});

// 게시물 등록 버튼 클릭 이벤트
document.getElementById("registPostBtn").addEventListener("click", () => {});

// 리스트 아이템 클릭 이벤트 (포스트 상세 조회)
document.querySelectorAll(".list-group-item").forEach((item) => {
    item.addEventListener("click", () => {
        // 상세 정보 채우기 (나중에 실제 DB 연동 가능)
        document.getElementById("detailTitle").innerText = item.innerText; // title
        document.getElementById("detailContent").innerText =
            item.innerText + " 의 상세 내용입니다."; // content

        const detailModal = new bootstrap.Modal(
            document.getElementById("postDetailModal")
        );
        detailModal.show();
    });
});
