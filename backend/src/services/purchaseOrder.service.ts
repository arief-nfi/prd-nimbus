import { PrismaClient } from '@prisma/client';
import { PurchaseOrderSchema, UpdatePurchaseOrderSchema } from '../../../shared/validation/purchaseOrder.schema';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export class PurchaseOrderService {
  /**
   * Generates a reactive PO ID based on date and node
   * Implementation for FR-001 / VR-003
   */
  async generatePoId(nodeId: string, date: Date): Promise<string> {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const prefix = `${nodeId}-PO-${year}${month}`;
    
    const count = await prisma.purchaseOrder.count({
      where: { poId: { startsWith: prefix } }
    });
    
    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async createPurchaseOrder(data: any) {
    const validatedData = PurchaseOrderSchema.parse(data);
    
    return await prisma.purchaseOrder.create({
      data: validatedData
    });
  }

  async updatePurchaseOrder(id: string, data: any) {
    const existing = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw new AppError('Order not found', 404);

    // Validate against VR-003 immutability rules
    const validationResult = UpdatePurchaseOrderSchema.safeParse({
      ...data,
      originalPoId: existing.poId,
      originalStatus: existing.status
    });

    if (!validationResult.success) {
      console.error('[VR-003 Violation]:', validationResult.error.format());
      throw new AppError(validationResult.error.errors[0].message, 400);
    }

    return await prisma.purchaseOrder.update({
      where: { id },
      data: validationResult.data
    });
  }
}