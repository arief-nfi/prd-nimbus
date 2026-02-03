import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PurchaseOrderLineItemService } from '../services/purchaseOrderLineItem.service';

const router = Router();

const paramsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid PurchaseOrderLineItem ID format' }),
});

/**
 * @route GET /api/purchase-order-line-items/:id
 * @desc Get PurchaseOrderLineItem by ID
 * @access Private
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const validation = paramsSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    // 2. Query Database
    const lineItem = await PurchaseOrderLineItemService.getById(id);

    // 3. Handle Not Found
    if (!lineItem) {
      return res.status(404).json({
        message: `PurchaseOrderLineItem with ID ${id} not found`,
      });
    }

    // 4. Return Success Response
    return res.status(200).json({
      id: lineItem.id,
      poId: lineItem.poId,
      itemId: lineItem.itemId,
      quantity: Number(lineItem.quantity),
      unitPrice: Number(lineItem.unitPrice),
      totalAmount: Number(lineItem.totalAmount),
    });
  } catch (error) {
    console.error(`[PurchaseOrderLineItem_GetById_Error]:`, error);
    return res.status(500).json({
      message: 'An internal server error occurred while fetching the record',
    });
  }
});

export default router;
