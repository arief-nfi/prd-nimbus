import React, { useCallback } from 'react';
import { useFileUploadValidation } from '../hooks/useFileUploadValidation';

interface FileUploaderProps {
  onUploadSuccess: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const { error, validateFiles, setError } = useFileUploadValidation();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    
    if (selectedFiles.length === 0) return;

    // VR-029 Logic: If user uploads again, it replaces previous.
    // If user attempts to select multiple at once, validate.
    if (selectedFiles.length > 1) {
      setError("|");
      return;
    }

    if (validateFiles(selectedFiles)) {
      onUploadSuccess(selectedFiles[0]);
    }
  }, [validateFiles, onUploadSuccess, setError]);

  return (
    <div className="file-uploader-container">
      <input
        type="file"
        multiple={false}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        aria-label="Upload Document"
      />
      {error && <span className="error-text" style={{ color: 'red' }}>{error}</span>}
    </div>
  );
};