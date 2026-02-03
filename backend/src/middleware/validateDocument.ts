import { Request, Response, NextFunction } from 'express';
import { documentUploadSchema } from '../validators/document.validator';
import { ZodError } from 'zod';

export const validateDocumentUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataToValidate = {
      ...req.body,
      file: req.file,
      // Ensure numeric values are converted from strings if coming from multipart/form-data
      paymentDetails: {
        downPaymentPercentage: Number(req.body.downPaymentPercentage),
        grandTotal: Number(req.body.grandTotal),
        dpAmount: Number(req.body.dpAmount),
        paidAmount: Number(req.body.paidAmount),
      }
    };

    documentUploadSchema.parse(dataToValidate);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('[VR-027] Validation Failure:', error.errors);
      return res.status(400).json({
        success: false,
        errors: error.errors.map(e => ({
          path: e.path,
          message: e.message
        }))
      });
    }
    next(error);
  }
};