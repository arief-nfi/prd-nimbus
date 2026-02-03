import { PrismaClient, PurchaseOrder, Prisma } from '@prisma/client';

export class PurchaseOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.PurchaseOrderCreateInput, tx?: Prisma.TransactionClient): Promise<PurchaseOrder> {
    const client = tx || this.prisma;
    return client.purchaseOrder.create({
      data,
      include: {
        lineItems: true,
        attachment: true,
        supplier: true,
      },
    });
  }

  async findById(id: string): Promise<PurchaseOrder | null> {
    return this.prisma.purchaseOrder.findUnique({
      where: { id, deletedAt: null },
      include: {
        lineItems: true,
        attachment: true,
        supplier: true,
      },
    });
  }

  async findAll(params: { 
    skip?: number; 
    take?: number; 
    where?: Prisma.PurchaseOrderWhereInput; 
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput 
  }): Promise<[PurchaseOrder[], number]> {
    const { skip, take, where, orderBy } = params;
    const queryWhere = { ...where, deletedAt: null };
    return Promise.all([
      this.prisma.purchaseOrder.findMany({
        skip,
        take,
        where: queryWhere,
        orderBy,
        include: { supplier: true },
      }),
      this.prisma.purchaseOrder.count({ where: queryWhere }),
    ]);
  }

  async update(id: string, data: Prisma.PurchaseOrderUpdateInput, tx?: Prisma.TransactionClient): Promise<PurchaseOrder> {
    const client = tx || this.prisma;
    return client.purchaseOrder.update({
      where: { id },
      data,
      include: {
        lineItems: true,
        attachment: true,
      },
    });
  }

  async softDelete(id: string, userId: string, tx?: Prisma.TransactionClient): Promise<PurchaseOrder> {
    const client = tx || this.prisma;
    return client.purchaseOrder.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async findByPoId(poId: string): Promise<PurchaseOrder | null> {
    return this.prisma.purchaseOrder.findFirst({
      where: { poId, deletedAt: null },
    });
  }
}