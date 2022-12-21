import { Router } from "express";
import userController from "../controllers/User";
import loginRequired from "../middlewares/loginRequired";

const userRouter = new Router();

userRouter.get("/", loginRequired, userController.show);
userRouter.post("/", userController.store);
userRouter.put("/", loginRequired, userController.update);
userRouter.delete("/", loginRequired, userController.delete);

export default userRouter;
