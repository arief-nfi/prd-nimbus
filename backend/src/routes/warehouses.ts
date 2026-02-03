import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { WarehouseService } from '../services/warehouse.service';

const router = Router();

const paramsSchema = z.object({
  id: z.string().uuid('Invalid Warehouse ID format'),
});

/**
 * @route DELETE /api/warehouses/:id
 * @desc Soft delete a warehouse and its sub-nodes
 * @access Private
 */
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validation
      const validation = paramsSchema.safeParse(req.params);
      if (!validation.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.error.errors,
        });
      }

      const { id } = validation.data;
      
      // 2. Authorization (Mocking user ID from middleware context)
      // In production, req.user would be populated by auth middleware
      const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

      // 3. Operation
      const deletedWarehouse = await WarehouseService.softDelete(id, userId);

      if (!deletedWarehouse) {
        return res.status(404).json({
          message: `Warehouse with ID ${id} not found`,
        });
      }

      // 4. Response
      return res.status(204).send();
    } catch (error) {
      console.error('[WarehouseDeleteError]:', error);
      return res.status(500).json({
        message: 'An internal server error occurred while deleting the warehouse',
      });
    }
  }
);

export default router;
