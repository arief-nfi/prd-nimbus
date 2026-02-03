import { Router, Request, Response, NextFunction } from 'express';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { z } from 'zod';

const router = Router();
const purchaseOrderService = new PurchaseOrderService();

const idSchema = z.object({
  id: z.string().uuid('Invalid Purchase Order ID format')
});

/**
 * @route   DELETE /api/purchase-orders/:id
 * @desc    Soft delete a Purchase Order
 * @access  Private
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idSchema.parse(req.params);
    
    // In production, 'deletedBy' would come from req.user.id (Auth middleware)
    const deletedBy = (req as any).user?.id || null;

    await purchaseOrderService.deletePurchaseOrder(id, deletedBy);

    return res.status(204).send();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.errors 
      });
    }

    if (error.message === 'PurchaseOrder not found') {
      return res.status(404).json({ message: error.message });
    }

    next(error);
  }
});

export default router;