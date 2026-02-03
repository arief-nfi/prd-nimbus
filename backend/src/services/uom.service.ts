import { PrismaClient } from '@prisma/client';
import { StatusEnum } from '../../../shared/validation/uom.schema';

const prisma = new PrismaClient();

export class UomService {
  /**
   * Retrieves UOMs filtered by Active status for dropdown menus
   * Implementation of VR-008
   */
  async getActiveUoms() {
    return prisma.uom.findMany({
      where: {
        status: StatusEnum.Active,
        deletedAt: null
      },
      select: {
        id: true,
        code: true,
        name: true
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Validates if a UOM can be deactivated based on usage in active Items
   */
  async validateDeactivation(uomId: string) {
    const activeItemCount = await prisma.item.count({
      where: {
        uomId: uomId,
        status: StatusEnum.Active,
        deletedAt: null
      }
    });

    if (activeItemCount > 0) {
      throw new Error(`Cannot deactivate UOM: Currently used by ${activeItemCount} active item(s).`);
    }

    return true;
  }
}