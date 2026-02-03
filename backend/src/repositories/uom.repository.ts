import { PrismaClient, Uom, Prisma } from '@prisma/client';

export class UomRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UomWhereInput;
    orderBy?: Prisma.UomOrderByWithRelationInput;
  }): Promise<Uom[]> {
    return this.prisma.uom.findMany({
      ...params,
      where: { ...params.where, deletedAt: null },
    });
  }

  async findById(id: string): Promise<Uom | null> {
    return this.prisma.uom.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByCode(code: string): Promise<Uom | null> {
    return this.prisma.uom.findFirst({
      where: { code, deletedAt: null },
    });
  }

  async create(data: Prisma.UomCreateInput, tx?: Prisma.TransactionClient): Promise<Uom> {
    const client = tx || this.prisma;
    return client.uom.create({ data });
  }

  async update(id: string, data: Prisma.UomUpdateInput, tx?: Prisma.TransactionClient): Promise<Uom> {
    const client = tx || this.prisma;
    return client.uom.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string, tx?: Prisma.TransactionClient): Promise<Uom> {
    const client = tx || this.prisma;
    return client.uom.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async count(where?: Prisma.UomWhereInput): Promise<number> {
    return this.prisma.uom.count({
      where: { ...where, deletedAt: null },
    });
  }
}