import { Request, Response, NextFunction } from 'express';
import { WarehouseSchema } from '../../../shared/validation/warehouse.schema.js';
import { logger } from '../utils/logger';

export const validateWarehouse = (req: Request, res: Response, next: NextFunction) => {
  try {
    WarehouseSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Validation Failure VR-015:', { 
        error: error.message, 
        body: req.body 
      });
    }
    return res.status(400).json({
      success: false,
      errors: error instanceof Error ? error : 'Validation failed',
    });
  }
};