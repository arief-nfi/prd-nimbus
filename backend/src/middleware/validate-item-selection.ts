import { Request, Response, NextFunction } from 'express';
import { ItemSelectionSchema } from '../validations/item.validation';
import { ZodError } from 'zod';

export const validateItemSelection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ItemSelectionSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    
    console.error('[VR-010 Validation Error]:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during validation",
    });
  }
};