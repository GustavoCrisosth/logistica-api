import { prisma } from '../lib/prisma.js';
import crypto from 'crypto';

interface CreateDeliveryDTO {
  customer_name: string;
  customer_email: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
}

export class DeliveryService {
  async listAll() {
    return await prisma.delivery.findMany();
  }

  async execute(data: CreateDeliveryDTO) {
    const trackingCode = `TRK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await prisma.$queryRaw`
      INSERT INTO "deliveries" (
        id, 
        tracking_code, 
        customer_name, 
        customer_email, 
        pickup_location, 
        dropoff_location, 
        "updatedAt"
      )
      VALUES (
        gen_random_uuid(),
        ${trackingCode},
        ${data.customer_name},
        ${data.customer_email},
        ST_SetSRID(ST_MakePoint(${data.pickup_lng}, ${data.pickup_lat}), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${data.dropoff_lng}, ${data.dropoff_lat}), 4326)::geography,
        now()
      )
      RETURNING id, tracking_code, customer_name, status;
    `;

    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }

    throw new Error('Erro ao criar a entrega no banco de dados.');
  }

  async saveLocation(deliveryId: string, lat: number, lng: number) {
    await prisma.$executeRaw`
    INSERT INTO delivery_locations_history (id, delivery_id, location, timestamp)
    VALUES (
      gen_random_uuid(), 
      ${deliveryId}, 
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, 
      NOW()
    )
  `;
  }
}