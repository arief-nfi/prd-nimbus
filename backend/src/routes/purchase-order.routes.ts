import { Router } from 'express';
import { purchaseOrderSchema } from '../../../shared/validation/purchase-order.schema.js';
import { validateRequest } from '../middleware/validate-request';

const router = Router();

router.post(
  '/',
  validateRequest(purchaseOrderSchema),
  async (req, res) => {
    try {
      // Service logic would go here
      res.status(201).json({ success: true, data: req.body });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create purchase order' });
    }
  }
);

export default router;