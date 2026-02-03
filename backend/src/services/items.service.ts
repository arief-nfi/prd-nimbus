import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ItemService {
  /**
   * Performs a soft delete on an Item entity
   * @param id The UUID of the item
   * @param deletedBy The UUID of the user performing the deletion
   */
  async softDeleteItem(id: string, deletedBy?: string) {
    const existingItem = await prisma.items.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!existingItem) {
      throw new Error('Item not found');
    }

    return await prisma.items.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: deletedBy,
        status: 'Inactive' // Optional: update status to inactive upon deletion
      }
    });
  }

  /**
   * Find an item by ID (helper)
   */
  async findById(id: string) {
    return await prisma.items.findFirst({
      where: {
        id,
        deleted_at: null
      }
    });
  }
}