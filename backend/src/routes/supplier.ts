import { Router, Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';

const router = Router();
const supplierService = new SupplierService();

const getSupplierSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid supplier ID format' }),
  }),
});

/**
 * @route GET /api/suppliers/:id
 * @desc Get supplier by ID
 * @access Private
 */
router.get(
  '/:id',
  authenticate,
  validateRequest(getSupplierSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const supplier = await supplierService.getSupplierById(id);

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Supplier not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;