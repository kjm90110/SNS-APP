import * as postRepository from '../data/post'

// 포스트 목록 페이지 (전체 조회)
export async function getPosts() {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 목록 조회 실패" });
    }
};

// 특정 포스트 아이디에 해당하는 포스트 가져오기
export async function getPost() {
    try {
        const id = req.params.id;
        const post = await getPostById(id);
        res.status(200).json(post); 
    } catch(error) {
        console.error(error);
        res.status(500).json({message: '포스트 가져오기 실패'})
    }
}

// 포스트 작성 페이지 (POST /post)
export async function create() {
    try {
        const { title, content } = req.body;
        const useridx = req.user.idx;  // JWT 인증된 사용자

        if (!title || !content) {
            return res.status(400).json({ message: "제목/내용은 필수" });
        }

        const post = await createPost({ title, content, useridx });

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 작성 실패" });
    }
};

// 포스트 상세 페이지 (GET /post/:id)
export async function detail() {
    try {
        const { id } = req.params;
        const post = await getPostById(id);

        if (!post) return res.status(404).json({ message: "게시물이 없음" });

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "상세 조회 실패" });
    }
};

// 포스트 수정 페이지 (PUT /post/:id)
export async function update() {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await getPostById(id);
        if (!post) return res.status(404).json({ message: "게시물이 없음" });

        // 본인 글만 수정 가능
        if (post.useridx !== req.user.idx) {
            return res.status(403).json({ message: "수정 권한 없음" });
        }

        await updatePost(id, { title, content });

        res.status(200).json({ message: "수정 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 수정 실패" });
    }
};

// 포스트 삭제 기능 (DELETE /post/:id)
export async function remove() {
    try {
        const { id } = req.params;

        const post = await getPostById(id);
        if (!post) return res.status(404).json({ message: "게시물이 없음" });

        // 본인 글만 삭제 가능
        if (post.useridx !== req.user.idx) {
            return res.status(403).json({ message: "삭제 권한 없음" });
        }

        await deletePost(id);
        res.status(200).json({ message: "삭제 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 삭제 실패" });
    }
};

// 특정 아이디(useridx)의 포스트 검색
export async function searchByUser() {
    try {
        const { useridx } = req.params.useridx;

        const posts = await getPostsByUser(useridx);

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "사용자 게시물 검색 실패" });
    }
};