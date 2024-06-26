import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import postsRouter from './router/posts.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { db } from './db/database.js';

// app을 만들고 필요한 라우터를 불러오자
const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan('tiny'));

app.use('/posts', postsRouter);
app.use('/auth', authRouter);

// 애플리케이션에서 처리해줄 수 없는 URL이라면 Not Found
app.use((req, res, next) => {
  res.sendStatus(404);
});

// 기본적인 에러처리
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

db.getConnection().then(() => {
  console.log(`Server is started... ${new Date()}`);
  const server = app.listen(config.port);
  initSocket(server);
});
