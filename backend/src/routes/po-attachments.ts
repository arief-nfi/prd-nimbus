import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PoAttachmentService } from '../services/po-attachment.service';

const router = Router();

const idParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid PoAttachment UUID' }),
});

/**
 * DELETE /api/po-attachments/:id
 * Deletes a specific PO attachment record
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validation
    const validation = idParamSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Bad Request',
        details: validation.error.format(),
      });
    }

    const { id } = validation.data;

    // 2. Authorization Check (Mock - should be handled by auth middleware)
    // if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // 3. Execution
    const deletedAttachment = await PoAttachmentService.delete(id);

    // 4. Handle Not Found
    if (!deletedAttachment) {
      return res.status(404).json({
        error: 'Not Found',
        message: `PoAttachment with ID ${id} not found`,
      });
    }

    // 5. Success Response
    console.info(`PoAttachment ${id} deleted successfully`);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting PoAttachment:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while deleting the attachment',
    });
  }
});

export default router;
