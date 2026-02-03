import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf"];

/**
 * VR-006: Validation for Address and Document Upload
 * Handles requirements for FR-025 and B-VR-027
 */
export const documentUploadSchema = z.object({
  address: z
    .string({
      required_error: "Address is required",
      invalid_type_error: "Address must be a string",
    })
    .trim()
    .min(1, "Address is required"),
  
  file: z
    .any()
    .refine((file) => file !== null && file !== undefined, "Document is required")
    .refine(
      (file) => 
        ACCEPTED_IMAGE_TYPES.includes(file?.mimetype) || 
        ACCEPTED_DOCUMENT_TYPES.includes(file?.mimetype),
      "Only PDF or Image files are allowed"
    )
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB"),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;