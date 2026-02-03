import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

/**
 * VR-004: Mandatory fields SHALL be marked with a red asterisk (*).
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  htmlFor,
}) => {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <label 
        htmlFor={htmlFor} 
        className="text-sm font-medium text-gray-700 flex items-center gap-0.5"
      >
        {label}
        {required && <span className="text-red-500 font-bold ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className="mt-1">
        {children}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-pulse" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};