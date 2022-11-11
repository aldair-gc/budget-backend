import { Router } from 'express';
import transactionController from '../controllers/Transaction';

const transactionRouter = new Router();

transactionRouter.get('/:year:month', transactionController.show);
transactionRouter.post('/', transactionController.store);
transactionRouter.put('/:id', transactionController.update);
transactionRouter.delete('/:id', transactionController.delete);

export default transactionRouter;
