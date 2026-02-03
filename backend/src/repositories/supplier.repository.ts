import { PrismaClient, Supplier, Prisma } from '@prisma/client';

export class SupplierRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findBySuppId(suppId: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({
      where: { suppId },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SupplierWhereInput;
    orderBy?: Prisma.SupplierOrderByWithRelationInput;
  }): Promise<[Supplier[], number]> {
    const { skip, take, where, orderBy } = params;
    return Promise.all([
      this.prisma.supplier.findMany({
        skip,
        take,
        where: { ...where, deletedAt: null },
        orderBy,
      }),
      this.prisma.supplier.count({ where: { ...where, deletedAt: null } }),
    ]);
  }

  async create(data: Prisma.SupplierCreateInput, tx?: Prisma.TransactionClient): Promise<Supplier> {
    const client = tx || this.prisma;
    return client.supplier.create({ data });
  }

  async update(id: string, data: Prisma.SupplierUpdateInput, tx?: Prisma.TransactionClient): Promise<Supplier> {
    const client = tx || this.prisma;
    return client.supplier.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string, tx?: Prisma.TransactionClient): Promise<Supplier> {
    const client = tx || this.prisma;
    return client.supplier.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }
}