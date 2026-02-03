import { useState } from 'react';
import { paymentValidationSchema, PaymentValidationInput } from '../../../shared/validation/payment-schema';
import { ZodError } from 'zod';

export const usePaymentValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: PaymentValidationInput): boolean => {
    try {
      paymentValidationSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  return { errors, validate, setErrors };
};