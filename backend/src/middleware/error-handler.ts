import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: err.errors[0].message,
      details: err.errors
    });
  }

  if (err.message.includes('Maximum sequence reached')) {
    return res.status(422).json({
      status: 'error',
      message: err.message
    });
  }

  if (err.message === 'Name must be unique') {
    return res.status(409).json({
      status: 'error',
      message: 'Name must be unique'
    });
  }

  console.error(`[Error Log]: ${err.stack}`);
  
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};