import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PurchaseOrderLineItemService {
  static async delete(id: string) {
    const lineItem = await prisma.purchaseOrderLineItem.findUnique({
      where: { id },
    });

    if (!lineItem) {
      return null;
    }

    // Using a transaction to ensure both deletion and PO total update occur
    return await prisma.$transaction(async (tx) => {
      const deleted = await tx.purchaseOrderLineItem.delete({
        where: { id },
      });

      // Recalculate Grand Total for the associated Purchase Order
      const remainingItems = await tx.purchaseOrderLineItem.findMany({
        where: { poId: lineItem.poId },
      });

      const newGrandTotal = remainingItems.reduce(
        (sum, item) => sum + Number(item.totalAmount),
        0
      );

      await tx.purchaseOrder.update({
        where: { id: lineItem.poId },
        data: { grandTotal: newGrandTotal },
      });

      return deleted;
    });
  }
}
