import express from "express";
import userController from '../controller/user.mjs'

const router = express.Router();

router.get("/", isAuth, userController)

router.get('/:id', isAuth, userController.getPost)

router.get("/:useridx", isAuth, userController.searchByUser)

router.post("/", isAuth, userController.create)

router.put("/:id", isAuth, userController.update)

router.delete("/:id", isAuth, userController.remove)

export default router;
