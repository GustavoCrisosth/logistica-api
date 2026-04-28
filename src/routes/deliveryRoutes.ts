import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../middlewares/authMiddleware.js';
import { DeliveryController } from '../controllers/DeliveryController.js';

const deliveryRoutes = Router();
const deliveryController = new DeliveryController();

deliveryRoutes.use(authMiddleware);

deliveryRoutes.get('/', (req: AuthRequest, res) => {
    return res.json({
        message: 'Acesso liberado à área secreta de entregas!',
        loggedUser: req.user
    });
});

deliveryRoutes.post('/', deliveryController.create);

export { deliveryRoutes };