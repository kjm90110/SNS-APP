import express from "express";
import * as postController from "../controller/post.mjs";
import { isAuth } from "../middleware/user.mjs";

const router = express.Router();

router.get("/user/:userIdx", isAuth, postController.searchByUser);

router.get("/:id", isAuth, postController.getPost);

router.get("/", isAuth, postController.getPosts);

// 게시물 등록
router.post("/", isAuth, postController.create);

// 게시물 수정
router.put("/:id", isAuth, postController.update);

// 게시물 삭제
router.delete("/:id", isAuth, postController.remove);

export default router;
