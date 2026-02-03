import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ItemService } from '../services/items.service';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const itemService = new ItemService();

const deleteItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid item ID format')
  })
});

/**
 * @route   DELETE /api/items/:id
 * @desc    Soft delete an item by setting deletedAt
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  validateRequest(deleteItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Assuming authenticate middleware attaches user to req

      await itemService.softDeleteItem(id, userId);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Item not found') {
        return res.status(404).json({ error: 'Item not found' });
      }
      next(error);
    }
  }
);

export default router;