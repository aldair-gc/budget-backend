import { Router } from 'express';
import userController from '../controllers/User';

const userRouter = new Router();

userRouter.get('/', userController.show);
userRouter.post('/', userController.store);
userRouter.put('/', userController.update);
userRouter.delete('/', userController.delete);

export default userRouter;
