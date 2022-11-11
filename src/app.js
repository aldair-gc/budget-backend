import dotenv from 'dotenv';

dotenv.config();

import './database';

import express from 'express';
import homeRouter from './routes/home';
import userRouter from './routes/user';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use('/', homeRouter);
    this.app.use('/user/', userRouter);
  }
}

export default new App().app;
