import { useState, useCallback } from 'react';
import { SingleFileUploadSchema } from '../../../backend/src/validation/fileUpload.schema';

export const useFileUploadValidation = () => {
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback((files: File[]) => {
    const result = SingleFileUploadSchema.safeParse({ files });
    
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input";
      setError(errorMessage);
      console.error(`[VR-029] Validation Failure: ${errorMessage}`, result.error.format());
      return false;
    }

    setError(null);
    return true;
  }, []);

  return { error, validateFiles, setError };
};