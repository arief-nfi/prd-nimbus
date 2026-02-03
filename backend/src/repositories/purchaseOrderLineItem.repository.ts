import { PrismaClient, PurchaseOrderLineItem, Prisma } from '@prisma/client';

export class PurchaseOrderLineItemRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<PurchaseOrderLineItem | null> {
    return this.prisma.purchaseOrderLineItem.findUnique({
      where: { id },
      include: { item: true }
    });
  }

  async findByPurchaseOrderId(poId: string): Promise<PurchaseOrderLineItem[]> {
    return this.prisma.purchaseOrderLineItem.findMany({
      where: { poId },
      include: { item: true }
    });
  }

  async create(data: Prisma.PurchaseOrderLineItemUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<PurchaseOrderLineItem> {
    const client = tx || this.prisma;
    return client.purchaseOrderLineItem.create({ data });
  }

  async update(id: string, data: Prisma.PurchaseOrderLineItemUncheckedUpdateInput, tx?: Prisma.TransactionClient): Promise<PurchaseOrderLineItem> {
    const client = tx || this.prisma;
    return client.purchaseOrderLineItem.update({
      where: { id },
      data
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<PurchaseOrderLineItem> {
    const client = tx || this.prisma;
    return client.purchaseOrderLineItem.delete({
      where: { id }
    });
  }

  async upsertMany(poId: string, items: Prisma.PurchaseOrderLineItemUncheckedCreateInput[], tx: Prisma.TransactionClient): Promise<void> {
    await tx.purchaseOrderLineItem.deleteMany({ where: { poId } });
    await tx.purchaseOrderLineItem.createMany({ data: items });
  }
}