import type { Request, Response } from 'express';
import { DeliveryService } from '../services/DeliveryService.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

export class DeliveryController {
    async create(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role !== 'ADMIN') {
                return res.status(403).json({ error: 'Apenas administradores podem criar entregas.' });
            }

            const { customer_name, customer_email, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng } = req.body;

            const deliveryService = new DeliveryService();
            const delivery = await deliveryService.execute({
                customer_name,
                customer_email,
                pickup_lat,
                pickup_lng,
                dropoff_lat,
                dropoff_lng
            });

            return res.status(201).json(delivery);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor ao criar entrega.' });
        }
    }
}