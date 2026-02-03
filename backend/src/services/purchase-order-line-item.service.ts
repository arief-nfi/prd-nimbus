import { PrismaClient, PurchaseOrderLineItem } from '@prisma/client';

const prisma = new PrismaClient();

export class PurchaseOrderLineItemService {
  /**
   * Updates an existing Purchase Order Line Item
   * @param id Unique identifier of the line item
   * @param data Update payload
   */
  static async updateLineItem(
    id: string, 
    data: {
      poId: string;
      itemId: string;
      quantity: number;
      unitPrice: number;
      totalAmount: number;
    }
  ): Promise<PurchaseOrderLineItem> {
    return await prisma.purchaseOrderLineItem.update({
      where: { id },
      data: {
        poId: data.poId,
        itemId: data.itemId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount: data.totalAmount
      }
    });
  }

  static async findById(id: string): Promise<PurchaseOrderLineItem | null> {
    return await prisma.purchaseOrderLineItem.findUnique({
      where: { id }
    });
  }
}