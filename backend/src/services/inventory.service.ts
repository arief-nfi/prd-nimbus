import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InventoryService {
  static async listInventory(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    
    // VR-010 & VR-030: Partial matching and case-insensitive search via Prisma 'contains' and 'mode: insensitive'
    const where = search ? {
      OR: [
        { item: { name: { contains: search, mode: 'insensitive' as const } } },
        { item: { sku: { contains: search, mode: 'insensitive' as const } } },
        { warehouse: { name: { contains: search, mode: 'insensitive' as const } } },
        { warehouse: { nodeId: { contains: search, mode: 'insensitive' as const } } }
      ]
    } : {};

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        include: {
          item: true,
          warehouse: true
        },
        orderBy: { lastReceivedAt: 'desc' }
      }),
      prisma.inventory.count({ where })
    ]);

    return { data, total, page, limit };
  }
}