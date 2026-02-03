import { PrismaClient, Prisma } from '@prisma/client';
import { POSearchInput } from '../validations/po.validation';

const prisma = new PrismaClient();

export class POService {
  /**
   * Implements VR-030: Case-insensitive partial matching for PO List
   */
  async listPOs(params: POSearchInput) {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseOrderWhereInput = {};

    if (search) {
      where.OR = [
        {
          poNumber: {
            contains: search,
            mode: 'insensitive', // Case-insensitive partial match
          },
        },
        {
          vendorName: {
            contains: search,
            mode: 'insensitive', // Case-insensitive partial match
          },
        },
      ];
    }

    try {
      const [data, total] = await Promise.all([
        prisma.purchaseOrder.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.purchaseOrder.count({ where }),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('[VR-030][PO_LIST_ERROR]:', error);
      throw new Error('Failed to fetch PO list');
    }
  }
}