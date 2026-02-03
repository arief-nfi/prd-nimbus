import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SupplierService } from '../services/supplier.service';

const router = Router();

const paramsSchema = z.object({
  id: z.string().uuid('Invalid supplier ID format'),
});

/**
 * @route DELETE /api/suppliers/:id
 * @desc Soft delete a supplier
 * @access Private
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validation = paramsSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }

    const { id } = validation.data;
    
    // In a real application, deletedBy would come from the authenticated user context (e.g., req.user.id)
    // Defaulting to a placeholder for this implementation
    const deletedBy = (req as any).user?.id || null;

    const deletedSupplier = await SupplierService.softDelete(id, deletedBy);

    if (!deletedSupplier) {
      return res.status(404).json({
        message: 'Supplier not found or already deleted',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(`[Supplier Delete Error]:`, error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

export default router;
