import { PrismaClient, Warehouse, Prisma } from '@prisma/client';

export class WarehouseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.WarehouseWhereInput;
    orderBy?: Prisma.WarehouseOrderByWithRelationInput;
  }): Promise<Warehouse[]> {
    return this.prisma.warehouse.findMany({
      ...params,
      where: { ...params.where, deletedAt: null },
    });
  }

  async findById(id: string): Promise<Warehouse | null> {
    return this.prisma.warehouse.findFirst({
      where: { id, deletedAt: null },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async create(data: Prisma.WarehouseCreateInput): Promise<Warehouse> {
    return this.prisma.warehouse.create({ data });
  }

  async update(id: string, data: Prisma.WarehouseUpdateInput): Promise<Warehouse> {
    return this.prisma.warehouse.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string): Promise<Warehouse> {
    return this.prisma.warehouse.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async count(where?: Prisma.WarehouseWhereInput): Promise<number> {
    return this.prisma.warehouse.count({
      where: { ...where, deletedAt: null },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.warehouse.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}