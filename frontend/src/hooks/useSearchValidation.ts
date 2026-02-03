import { useState, useCallback } from 'react';
import { SearchQuerySchema } from '../../../backend/src/validations/search.schema';

export const useSearchValidation = () => {
  const [error, setError] = useState<string | null>(null);

  const validateSearch = useCallback((query: string) => {
    const result = SearchQuerySchema.safeParse({ query });
    
    if (!result.success) {
      const message = result.error.errors[0]?.message || 'Invalid search query';
      setError(message);
      return false;
    }

    setError(null);
    return true;
  }, []);

  return { error, validateSearch, setError };
};