import { z } from 'zod';

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

/**
 * VR-027: File Upload Validation Schema
 * Validates that uploaded files are within size limits and allowed formats.
 * Specifically restricts .xlsx and other non-supported formats.
 */
export const documentUploadSchema = z.object({
  document: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Document is optional (B-VR-026)
      return file.size <= MAX_FILE_SIZE;
    }, 'File size must be less than 1.5MB')
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, 'Unsupported file format. Only PDF or Image (.jpg/.jpeg/.png) are allowed')
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;