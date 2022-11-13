import { Router } from 'express';
import tokenController from '../controllers/Token';

const tokenRouter = new Router();

tokenRouter.post('/', tokenController.store);

export default tokenRouter;
