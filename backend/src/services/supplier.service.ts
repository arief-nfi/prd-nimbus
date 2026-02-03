import { PrismaClient, SupplierStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class SupplierService {
  static async listSuppliers(params: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const whereClause = search ? {
      OR: [
        { suppId: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
        { picName: { contains: search, mode: 'insensitive' as const } },
      ],
      deletedAt: null,
    } : { deletedAt: null };

    const [data, total] = await Promise.all([
      prisma.supplier.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supplier.count({ where: whereClause }),
    ]);

    return { data, total, page, limit };
  }

  static async getSupplierById(id: string) {
    return prisma.supplier.findFirst({
      where: { id, deletedAt: null },
    });
  }
}