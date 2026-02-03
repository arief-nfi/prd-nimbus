import { useState, useCallback } from 'react';
import { skuSchema } from '../../../shared/validation/sku.schema';

export const useSkuValidation = () => {
  const [error, setError] = useState<string | null>(null);

  const validateSku = useCallback((sku: string) => {
    const result = skuSchema.safeParse(sku);
    if (!result.success) {
      const message = result.error.errors[0].message;
      setError(message);
      return false;
    }
    setError(null);
    return true;
  }, []);

  return { error, validateSku, setError };
};