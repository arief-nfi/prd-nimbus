import { PrismaClient, Item, Prisma } from '@prisma/client';

export class ItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: { id, deletedAt: null },
      include: { uom: true },
    });
  }

  async findBySku(sku: string): Promise<Item | null> {
    return this.prisma.item.findFirst({
      where: { sku, deletedAt: null },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
  }): Promise<[Item[], number]> {
    const { skip, take, where, orderBy } = params;
    const queryWhere = { ...where, deletedAt: null };
    return Promise.all([
      this.prisma.item.findMany({
        skip,
        take,
        where: queryWhere,
        orderBy,
        include: { uom: true },
      }),
      this.prisma.item.count({ where: queryWhere }),
    ]);
  }

  async create(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  async update(id: string, data: Prisma.ItemUpdateInput): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, deletedBy: string): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.item.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}