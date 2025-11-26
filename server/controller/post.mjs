import * as postRepository from '../data/post.mjs'

// 전체 포스트 조회
export async function getPosts(req, res) {
    try {
        const posts = await postRepository.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 목록 조회 실패" });
    }
}

// 특정 포스트 조회
export async function getPost(req, res) {
    try {
        const { id } = req.params;
        const post = await postRepository.getPostById(id);

        if (!post) return res.status(404).json({ message: "게시물이 없음" });
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 조회 실패" });
    }
}

// 포스트 작성
export async function create(req, res) {
    try {
        const { title, content } = req.body;
        const useridx = req.user.idx; // isAuth에서 검증 완료

        if (!title || !content) {
            return res.status(400).json({ message: "제목/내용은 필수" });
        }

        const post = await postRepository.createPost({ title, content, useridx });
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 작성 실패" });
    }
}

// 포스트 수정
export async function update(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await postRepository.getPostById(id);
        if (!post) return res.status(404).json({ message: "게시물이 없음" });

        if (post.useridx !== req.user.idx) {
            return res.status(403).json({ message: "수정 권한 없음" });
        }

        await postRepository.updatePost(id, { title, content });
        res.status(200).json({ message: "수정 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 수정 실패" });
    }
}

// 포스트 삭제
export async function remove(req, res) {
    try {
        const { id } = req.params;

        const post = await postRepository.getPostById(id);
        if (!post) return res.status(404).json({ message: "게시물이 없음" });

        if (post.useridx !== req.user.idx) {
            return res.status(403).json({ message: "삭제 권한 없음" });
        }

        await postRepository.deletePost(id);
        res.status(200).json({ message: "삭제 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "포스트 삭제 실패" });
    }
}

// 특정 사용자 게시물 조회
export async function searchByUser(req, res) {
    try {
        const { useridx } = req.params;
        const posts = await postRepository.getPostsByUser(useridx);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "사용자 게시물 검색 실패" });
    }
}
