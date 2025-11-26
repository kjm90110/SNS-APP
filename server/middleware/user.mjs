import jwt, { decode } from "jsonwebtoken";
import * as userRepository from "../data/user";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    console.log(authHeader);

    if (!(authHeader && authHeader.startsWith("Bearer "))) {
        // 인증 실패
        console.log("Header Error");
        return res.status(401).json(AUTH_ERROR);
    }

    // 인증 성공
    const token = authHeader.split(" ")[1];
    console.log("토큰 분리 성공:", token);

    jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
        if (error) {
            console.log(error);
            return res.status(401).json(AUTH_ERROR);
        }
        console.log(decoded);
        const user = await userRepository.getUserByIdx(decoded.id)

        if (!user) {
            console.log("아이디 없음");
            return res.status(401).json(AUTH_ERROR);
        }
        console.log("user id:", user.id);
        console.log("user.userid:", user.userid);
        req.id = user.id;

        /*
      토큰 분리 성공: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjM5NDM5MzI3MTUiLCJpYXQiOjE3NjM5NDM5MzQsImV4cCI6MTc2NDExNjczNH0.zMnLfPDVVOpeSw8H3TQ-V8HmHiHFOVKkJQ5VabEcxAY
      { id: '1763943932715', iat: 1763943934, exp: 1764116734 }      
      user id: 1763943932715
      user.userid: cherry
    */

        next();
    });
};
