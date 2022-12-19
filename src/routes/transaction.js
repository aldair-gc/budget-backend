import { Router } from 'express';
import transactionController from '../controllers/Transaction';
import loginRequired from '../middlewares/loginRequired';

const transactionRouter = new Router();

transactionRouter.get('/sum-until/:year/:month', loginRequired, transactionController.summary);
transactionRouter.get('/:year/:month', loginRequired, transactionController.index);
transactionRouter.get('/:id', loginRequired, transactionController.show);
transactionRouter.post('/', loginRequired, transactionController.store);
transactionRouter.put('/:id', loginRequired, transactionController.update);
transactionRouter.delete('/:id', loginRequired, transactionController.delete);

export default transactionRouter;
