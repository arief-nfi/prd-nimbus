import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PurchaseOrderService {
  /**
   * Performs a soft delete on a PurchaseOrder by setting deleted_at and deleted_by
   * @param id The UUID of the Purchase Order
   * @param deletedBy The UUID of the user performing the deletion
   */
  async deletePurchaseOrder(id: string, deletedBy?: string) {
    const existingOrder = await prisma.purchase_orders.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!existingOrder) {
      throw new Error('PurchaseOrder not found');
    }

    return await prisma.purchase_orders.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: deletedBy,
        // Also update the updated_at field as per standard audit practices
        updated_at: new Date(),
        updated_by: deletedBy
      }
    });
  }
}