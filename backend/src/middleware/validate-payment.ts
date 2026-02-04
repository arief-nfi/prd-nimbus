import { Request, Response, NextFunction } from 'express';
import { paymentValidationSchema } from '../../../shared/validation/payment-schema.js';
import { ZodError } from 'zod';

export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    paymentValidationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`[Validation Error] VR-020 Failure: ${JSON.stringify(error.errors)}`);
      return res.status(400).json({
        status: 'error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next(error);
  }
};