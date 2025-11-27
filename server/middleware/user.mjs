import jwt from "jsonwebtoken";
import * as userRepository from "../data/user.mjs";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        console.log("authHeader:", authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(AUTH_ERROR)
        }
        
        const token = authHeader.split(" ")[1];
        console.log("token:", token);

        // jwt.verify를 Promise로 wrapping
        const decoded = jwt.verify(token, config.jwt.secretKey);
        console.log("decoded token:", decoded);

        // 사용자 확인
        const user = await userRepository.getUserByIdx(decoded.id);
        if (!user) return res.status(401).json(AUTH_ERROR);

        // controller에서 req.user.idx 또는 req.idx 사용 가능하도록 둘 다 설정
        req.user = { idx: user.idx };  // ← 추가
        req.idx = user.idx;             // ← 기존 (호환성 유지)
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json(AUTH_ERROR);
    }
};