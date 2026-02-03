import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { InventoryService } from '../services/inventory.service';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const inventoryService = new InventoryService();

const deleteSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Inventory ID format'),
  }),
});

/**
 * @route DELETE /api/inventories/:id
 * @desc Delete an inventory record
 * @access Private
 */
router.delete(
  '/:id',
  authenticate,
  validateRequest(deleteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await inventoryService.deleteInventory(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;