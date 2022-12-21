import dotenv from "dotenv";

dotenv.config();

import "./database";

import express from "express";
import cors from "cors";
// import helmet from 'helmet';

import homeRouter from "./routes/home";
import userRouter from "./routes/user";
import transactionRouter from "./routes/transaction";
import tokenRouter from "./routes/token";

const whiteList = [
  "https://budget.aldairgc.com",
  "https://www.budget.aldairgc.com",
  "https://budget-server.aldairgc.com",
  "https://www.budget-server.aldairgc.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS (agc)"));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    // this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/", homeRouter);
    this.app.use("/user/", userRouter);
    this.app.use("/transaction/", transactionRouter);
    this.app.use("/token/", tokenRouter);
  }
}

export default new App().app;
