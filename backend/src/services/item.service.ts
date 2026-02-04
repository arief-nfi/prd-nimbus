import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/errors.js';

const prisma = new PrismaClient();

// VR-011: SKU validation schema
const CONSONANT_REGEX = /^[BCDFGHJKLMNPQRSTVWXYZ]{3}-[0-9]{4}$/;

const skuSchema = z.string({
  required_error: "SKU is required",
})
.trim()
.toUpperCase()
.regex(CONSONANT_REGEX, {
  message: "SKU must follow the format: 3 uppercase consonants followed by a hyphen and 4 digits (e.g., KMN-0001)"
});

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  sku: skuSchema,
  brand: z.string().min(1, "Brand is required").nullable().optional(),
  name: z.string().min(1, "Item name is required"),
  uomId: z.string().uuid("Invalid UOM selection"),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export type ItemInput = z.infer<typeof itemSchema>;

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