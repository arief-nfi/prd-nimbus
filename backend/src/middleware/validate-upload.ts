import { Request, Response, NextFunction } from 'express';
import { documentUploadSchema } from '../../../shared/validation/document-upload.schema.js';
import { logger } from '../utils/logger';

export const validateDocumentUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    // If file exists in request (from multer or similar middleware)
    const fileToValidate = req.file;
    
    if (fileToValidate) {
      documentUploadSchema.parse({ document: fileToValidate });
    }
    
    next();
  } catch (error: any) {
    logger.error('Validation failure VR-027:', { 
      error: error.errors, 
      path: req.path, 
      ip: req.ip 
    });

    return res.status(400).json({
      success: false,
      message: 'Unsupported file format. Only PDF or Image (.jpg/.jpeg/.png) are allowed',
      errors: error.errors
    });
  }
};