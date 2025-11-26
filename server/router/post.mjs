import express from "express";
import * as postController from '../controller/post.mjs'
import { isAuth } from "../middleware/user.mjs";

const router = express.Router();

router.get("/", isAuth, postController.getPosts)

router.get('/:id', isAuth, postController.getPost)

router.get("/:useridx", isAuth, postController.searchByUser)

router.post("/", isAuth, postController.create)

router.put("/:id", isAuth, postController.update)

router.delete("/:id", isAuth, postController.remove)

export default router;
