import { Request, Response, NextFunction } from 'express';
import { WarehouseOrderSchema } from '../../../shared/validation/payment-schema.js';
import { logger } from '../utils/logger';

export const validateWarehouseOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = await WarehouseOrderSchema.parseAsync(req.body);
    req.body = validatedData;
    next();
  } catch (error: any) {
    logger.error('Validation Failure VR-016:', { 
      errors: error.errors, 
      payload: req.body 
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }
};