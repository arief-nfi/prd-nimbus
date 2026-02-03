import { Request, Response, NextFunction } from 'express';
import { SingleFileUploadSchema } from '../validation/fileUpload.schema';

/**
 * Middleware to enforce VR-029 on the server side.
 */
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [];
  
  const validation = SingleFileUploadSchema.safeParse({
    files,
    warehouseId: req.body.warehouseId
  });

  if (!validation.success) {
    console.warn(`[SECURITY][VR-029] Validation blocked: ${JSON.stringify(validation.error.format())}`);
    return res.status(400).json({
      status: 'error',
      message: validation.error.issues[0]?.message || "|"
    });
  }

  next();
};