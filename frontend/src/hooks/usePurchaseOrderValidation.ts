import { purchaseOrderSchema, PurchaseOrderInput } from '../../../backend/src/validation/purchaseOrder.schema';
import { useState } from 'react';

export const usePurchaseOrderValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: Partial<PurchaseOrderInput>) => {
    const result = purchaseOrderSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  return { validate, errors, setErrors };
};