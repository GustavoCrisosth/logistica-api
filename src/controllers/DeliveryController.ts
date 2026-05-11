import type { Request, Response } from 'express';
import { DeliveryService } from '../services/DeliveryService.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { prisma } from '../lib/prisma.js';

export class DeliveryController {
    async list(req: AuthRequest, res: Response) {
        try {
            const deliveryService = new DeliveryService();

            const deliveries = await deliveryService.listAll();

            return res.json({
                message: 'Acesso liberado à área secreta de entregas!',
                loggedUser: req.user,
                deliveries: deliveries
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno ao listar entregas.' });
        }
    }

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

    async getDelivery(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const delivery = await prisma.delivery.findUnique({
                where: { id: id as string }
            });

            if (!delivery) return res.status(404).json({ error: 'Entrega não encontrada' });

            const history = await prisma.$queryRaw<any[]>`
            SELECT 
                id, 
                ST_Y(location::geometry) as latitude, 
                ST_X(location::geometry) as longitude, 
                timestamp 
            FROM delivery_locations_history 
            WHERE delivery_id = ${id}
            ORDER BY timestamp ASC
        `;

            return res.json({
                ...delivery,
                history: history
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar rastro' });
        }
    }
}