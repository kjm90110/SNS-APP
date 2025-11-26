import express from "express";
import * as userRouter from "../router/user.mjs";
import * as postRouter from "../router/post.mjs";
import { config } from "./config.mjs";
import sequelize from "./db/database.mjs";

const app = express(express.json());

app.use("/user", userRouter);
app.use("/post", postRouter);

app.use((req, res, next) => {
    // /user, /post 이외의 모든 경로
    res.sendStatus(400);
});

app.listen(config.host.port, (error) => {
    if (error) {
        console.error(error);
    }

    sequelize.sync(); // db 연결
    console.log("서버 실행됨");
});
