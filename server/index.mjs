import express from "express";
import * as userRouter from "../router/user.mjs";
import * as postRouter from "../router/post.mjs";
import { config } from "./config.mjs";
import sequelize from "./db/database.mjs";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter.default);
app.use("/post", postRouter.default);

app.use((req, res, next) => {
    res.status(404).json({ message: `경로를 찾을 수 없습니다: ${req.path}` });
});

sequelize.sync()
    .then(() => {
        app.listen(config.host.port, () => {
            console.log(`서버 실행됨: http://localhost:${config.host.port}`);
        });
    })
    .catch((error) => {
        console.error("DB 연결 또는 서버 실행 오류:", error);
    });