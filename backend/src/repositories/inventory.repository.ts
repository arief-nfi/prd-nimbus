import { PrismaClient, Inventory, Prisma } from '@prisma/client';

export class InventoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Inventory | null> {
    return this.prisma.inventory.findUnique({
      where: { id },
      include: {
        item: true,
        warehouse: true
      }
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.InventoryWhereInput;
    orderBy?: Prisma.InventoryOrderByWithRelationInput;
  }): Promise<Inventory[]> {
    return this.prisma.inventory.findMany({
      ...params,
      include: {
        item: true,
        warehouse: true
      }
    });
  }

  async create(data: Prisma.InventoryCreateInput, tx?: Prisma.TransactionClient): Promise<Inventory> {
    const client = tx || this.prisma;
    return client.inventory.create({ data });
  }

  async update(id: string, data: Prisma.InventoryUpdateInput, tx?: Prisma.TransactionClient): Promise<Inventory> {
    const client = tx || this.prisma;
    return client.inventory.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<Inventory> {
    return this.prisma.inventory.delete({
      where: { id }
    });
  }

  async findByItemAndWarehouse(itemId: string, warehouseId: string, binId?: string): Promise<Inventory | null> {
    return this.prisma.inventory.findFirst({
      where: {
        itemId,
        warehouseId,
        binId: binId || null
      }
    });
  }

  async count(where?: Prisma.InventoryWhereInput): Promise<number> {
    return this.prisma.inventory.count({ where });
  }
}