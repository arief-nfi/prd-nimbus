import { PrismaClient } from '@prisma/client';
import { itemSchema, ItemInput } from '../../../shared/validation/sku.schema';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export class ItemService {
  /**
   * Validates and creates a new Item
   * Implementation of VR-011 and SKU Override Policy
   */
  async createItem(data: ItemInput, userId: string) {
    // 1. Validate Input Structure
    const validatedData = itemSchema.safeParse(data);
    
    if (!validatedData.success) {
      throw new AppError(validatedData.error.errors[0].message, 400);
    }

    const { sku, name, brand, uomId, status } = validatedData.data;

    // 2. Check for uniqueness
    const existingItem = await prisma.item.findUnique({
      where: { sku }
    });

    if (existingItem) {
      // Using the specific error message requirement from TASK-101
      throw new AppError("Maximum sequence reached for Item. Contact administrator.", 400);
    }

    // 3. Create Record
    return await prisma.item.create({
      data: {
        sku,
        name,
        brand,
        uomId,
        status: status || 'ACTIVE',
        createdBy: userId,
        updatedBy: userId
      }
    });
  }

  /**
   * Updates an existing item with SKU manual override support
   */
  async updateItem(id: string, data: Partial<ItemInput>, userId: string) {
    const validatedData = itemSchema.partial().safeParse(data);

    if (!validatedData.success) {
      throw new AppError(validatedData.error.errors[0].message, 400);
    }

    return await prisma.item.update({
      where: { id },
      data: {
        ...validatedData.data,
        updatedBy: userId,
        updatedAt: new Date()
      }
    });
  }
}