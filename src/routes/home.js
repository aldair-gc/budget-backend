import { Router } from "express";
import homeController from "../controllers/Home";

const homeRouter = new Router();

homeRouter.get("/", homeController.index);

export default homeRouter;
