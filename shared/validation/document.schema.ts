import { z } from 'zod';

/**
 * VR-026: | Submit form without document | Form submits successfully (document is optional) |
 * Description: Validates PDF document uploads while ensuring the field remains optional.
 */

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

export const DocumentUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  // VR-026: Document is optional, allowing null or undefined
  document: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional: success if no file provided
      return file.size <= MAX_FILE_SIZE;
    }, {
      message: 'File size must be less than 1.5MB',
    })
    .refine((file) => {
      if (!file) return true; // Optional: success if no file provided
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, {
      message: 'Only .pdf formats are supported',
    }),
});

export type DocumentUploadInput = z.infer<typeof DocumentUploadSchema>;