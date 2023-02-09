import { Router } from "express";
import PasswordController from "../controllers/Password";

const passwordRouter = new Router();

passwordRouter.post("/forgot/", PasswordController.store);
passwordRouter.put("/reset/", PasswordController.update);

export default passwordRouter;
