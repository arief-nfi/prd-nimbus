import { Request, Response, NextFunction } from 'express';
import { warehouseSupplierSchema } from '../validations/warehouse.schema';

/**
 * Middleware to validate supplier selection and payment totals
 */
export const validateWarehouseSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await warehouseSupplierSchema.parseAsync(req.body);
    next();
  } catch (error: any) {
    console.error('[VR-004][Validation Failure]:', JSON.stringify(error.errors));
    return res.status(400).json({
      success: false,
      errors: error.errors.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }
};