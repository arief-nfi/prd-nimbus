import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PurchaseOrderLineItemService } from '../services/purchaseOrderLineItem.service';

const router = Router();

const paramsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid ID format' }),
});

/**
 * @route DELETE /api/purchase-order-line-items/:id
 * @desc Delete a purchase order line item and update PO grand total
 */
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = paramsSchema.safeParse(req.params);
      if (!validation.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.error.errors,
        });
      }

      const { id } = validation.data;
      const result = await PurchaseOrderLineItemService.delete(id);

      if (!result) {
        return res.status(404).json({
          message: `PurchaseOrderLineItem with ID ${id} not found`,
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('[PurchaseOrderLineItem_Delete] Error:', error);
      return res.status(500).json({
        message: 'An internal server error occurred while deleting the line item',
      });
    }
  }
);

export default router;
