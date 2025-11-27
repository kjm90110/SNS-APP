import express from "express";
import * as userController from "../controller/user.mjs";
import { isAuth } from "../middleware/user.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/:idx", userController.getUserIdByIdx);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/user-ui/signup.html"));
});

// 로그인 유지 확인
router.post("/me", isAuth, userController.me);

export default router;
