import { prisma } from '../lib/prisma.js';

export class UpdateLocationService {
    async execute(delivery_id: string, lat: number, lng: number) {
        await prisma.$queryRaw`
      INSERT INTO "delivery_locations_history" (
        id, 
        delivery_id, 
        location, 
        timestamp
      ) 
      VALUES (
        gen_random_uuid(),
        ${delivery_id}::uuid,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        now()
      )
    `;
    }
}