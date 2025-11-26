import express from "express";
import postRouter from "./router/post.mjs";
import userRouter from "./router/user.mjs";
import { config } from "./config.mjs";
import sequelize from "./db/database.mjs";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());

app.use('/user-ui', express.static('../public/user-ui'));
app.use('/post-ui', express.static('../public/post-ui'));
app.use('/image', express.static(path.join(__dirname, '../public/image')));

app.use(cors({
    origin: [
        'http://localhost:8080', 
        'http://127.0.0.1:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/user", userRouter);
app.use("/post", postRouter);

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