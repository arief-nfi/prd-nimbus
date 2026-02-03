import { Request, Response, NextFunction } from 'express';

import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        ...req.body,
        file: req.file,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(`[Validation Error] ${JSON.stringify(error.errors)}`);
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };