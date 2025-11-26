import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as userRepository from "../data/user.mjs"; // 파일 경로에 맞게 수정 필요
import { config } from "../config.mjs";

// JWT 토큰 생성 함수는 그대로 유지
async function createJwtToken(idx) { // 매개변수 이름을 id에서 idx로 변경 권장
    return jwt.sign({ id: idx }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec,
    });
}

export async function renderMain() {
    location.href = ''
}

export async function signup(req, res, next) {
    const { userid, password, name, email } = req.body;

    // 1. 회원 중복 체크
    const found = await userRepository.getUserByUserId(userid);
    if (found) {
        return res.status(409).json({ message: `${userid}이 이미 있습니다` });
    }

    // 2. 비밀번호 해싱
    const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);
    
    // 3. 사용자 등록
    const user = await userRepository.createUser({
        userid,
        password: hashed,
        name,
        email,
    });
    
    // 4. JWT 생성 및 응답
    const token = await createJwtToken(user.idx); 
    console.log(token);
    
    // 보안을 위해 응답 시 비밀번호 제외
    // plain: true => db에서 가져온 user를 JS 객체로 맞춰줌
    const userResponse = user.get ? user.get({ plain: true }) : { ...user };
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
}


export async function login(req, res, next) {
    const { userid, password } = req.body;

    const loginUser = await userRepository.getUserByUserId(userid);
    if (!loginUser) {
        return res.status(401).json({ message: "아이디 또는 비밀번호를 확인해주세요" });
    }

    // 2. 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, loginUser.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: "아이디 또는 비밀번호를 확인해주세요" });
    }

    // 3. JWT 생성 및 응답
    const token = await createJwtToken(loginUser.idx); 
    
    // 응답 시 비밀번호 제거
    const userResponse = loginUser.get ? loginUser.get({ plain: true }) : { ...loginUser };
    delete userResponse.password;

    return res.status(200).json({ token, user: userResponse });
}


export async function me(req, res, next) {
    const user = await userRepository.getUserByIdx(req.idx); // req.idx를 사용하도록 가정
    
    if (!user) {
        return res.status(404).json({ message: "일치하는 사용자가 없습니다." });
    }
    
    return res.status(200).json({ userid: user.userid });
}