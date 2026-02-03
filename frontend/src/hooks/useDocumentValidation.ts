import { useState } from 'react';
import { documentUploadSchema } from '../../../shared/validation/document-upload.schema';

export const useDocumentValidation = () => {
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File | undefined): boolean => {
    setError(null);
    
    if (!file) return true; // Optional field logic

    const result = documentUploadSchema.safeParse({ document: file });
    
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Invalid file';
      setError(errorMessage);
      return false;
    }

    return true;
  };

  return { validateFile, error, setError };
};