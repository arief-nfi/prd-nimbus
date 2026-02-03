import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UomService } from '../services/uom.service';

const router = Router();

const paramsSchema = z.object({
  id: z.string().uuid('Invalid UOM ID format'),
});

/**
 * @route   DELETE /api/uoms/:id
 * @desc    Soft delete a UOM
 * @access  Private
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate path parameters
    const validation = paramsSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;
    
    // In a real application, userId would come from authenticated req.user
    const userId = (req as any).user?.id || null;

    const deletedUom = await UomService.deleteUom(id, userId);

    if (!deletedUom) {
      return res.status(404).json({
        message: `Uom with ID ${id} not found or already deleted`,
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(`[UomRoute][Delete] Error:`, error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

export default router;
