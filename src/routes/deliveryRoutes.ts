import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../middlewares/authMiddleware.js';
import { DeliveryController } from '../controllers/DeliveryController.js';

const deliveryRoutes = Router();
const deliveryController = new DeliveryController();

deliveryRoutes.use(authMiddleware);

deliveryRoutes.get('/', deliveryController.list);
deliveryRoutes.get('/:id', deliveryController.getDelivery);
deliveryRoutes.post('/', deliveryController.create);

export { deliveryRoutes };