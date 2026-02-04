import { Request, Response, NextFunction } from 'express';
import { DocumentUploadSchema } from '../../../shared/validation/document.schema.js';
import { logger } from '../utils/logger';

export const validateDocumentRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: In a real scenario with multipart/form-data, 
    // req.file would be handled by multer before this validation
    DocumentUploadSchema.parse({
      ...req.body,
      document: req.file,
    });
    next();
  } catch (error: any) {
    logger.warn('Validation failure VR-026:', { 
      errors: error.errors, 
      metadata: { 
        ruleId: 'VR-026', 
        timestamp: new Date().toISOString() 
      } 
    });
    
    return res.status(400).json({
      success: false,
      message: '|',
      errors: error.errors,
    });
  }
};