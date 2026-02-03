import { Router, Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const inventoryService = new InventoryService();

const querySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  sort: z.string().optional().default('id'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * @route GET /api/inventories
 * @desc List inventory records with pagination and sorting
 */
router.get(
  '/',
  validateRequest({ query: querySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sort, order } = req.query as unknown as z.infer<typeof querySchema>;

      const result = await inventoryService.list({
        page,
        limit,
        sort,
        order,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;