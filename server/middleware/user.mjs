import jwt from "jsonwebtoken";
import * as userRepository from "../data/user.mjs";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.redirect('/user-ui/signup.html')
        }

        const token = authHeader.split(" ")[1];

        // jwt.verify를 Promise로 wrapping
        const decoded = jwt.verify(token, config.jwt.secretKey);

        // 사용자 확인
        const user = await userRepository.getUserByIdx(decoded.id);
        if (!user) return res.status(401).json(AUTH_ERROR);

        req.id = user.id; // controller에서 req.id로 바로 접근 가능
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json(AUTH_ERROR);
    }
};
