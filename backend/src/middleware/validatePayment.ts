import { Request, Response, NextFunction } from 'express';
import { paymentValidationSchema } from '../validation/payment.schema';
import { logger } from '../utils/logger';

export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  const result = paymentValidationSchema.safeParse(req.body);

  if (!result.success) {
    logger.error('Validation Failure VR-018', {
      errors: result.error.format(),
      payload: req.body
    });

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors
    });
  }

  req.body = result.data;
  next();
};