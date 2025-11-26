import dotenv from "dotenv";
dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;

    if (!value) {
        throw new Error(`키 ${key}에 대한 value가 없음`);
    } else {
        return value;
    }
}

export const config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC")),
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS")),
    },
    host: {
        port: required("HOST_PORT"),
    },
    db: {
        host: required("DB_HOST"),
        user: required("DB_USER"),
        password: required("DB_PW"),
        port: required("DB_PORT"),
        name: required("DB_NAME"),
    },
};
