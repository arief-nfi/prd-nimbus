import { PrismaClient } from '@prisma/client';
import { SkuGenerationSchema, generateDeterministicSku } from '../validation/sku.validation';
import { AppError } from '../utils/errors.js';

const prisma = new PrismaClient();

export class WarehouseService {
  /**
   * Deactivates a Unit of Measure (UOM) with validation
   * Requirement: Cannot deactivate UOM if used by active items
   */
  async deactivateUom(uomId: string) {
    const activeItemsCount = await prisma.item.count({
      where: {
        uomId: uomId,
        status: 'ACTIVE'
      }
    });

    if (activeItemsCount > 0) {
      // VR-003: Error Message Requirement
      throw new Error(`Cannot deactivate UOM: Currently used by ${activeItemsCount} active item(s).`);
    }

    return prisma.uom.update({
      where: { id: uomId },
      data: { status: 'INACTIVE' }
    });
  }

  /**
   * Generates a deterministic SKU for a new item in a warehouse
   */
  async createItemSku(data: unknown) {
    const validation = SkuGenerationSchema.safeParse(data);
    
    if (!validation.success) {
      console.error('[Validation Failure] SKU Generation:', validation.error.format());
      throw new AppError('Invalid input for SKU generation', 400);
    }

    const sku = generateDeterministicSku(validation.data);
    return sku;
  }
}