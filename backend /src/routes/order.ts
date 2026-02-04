import { Router } from 'express';
import placeOrder from '../controllers/order';
import { validateOrderRequest } from '../middlewares/validations';

const router = Router();

router.post('/order', validateOrderRequest, placeOrder);

export default router;
