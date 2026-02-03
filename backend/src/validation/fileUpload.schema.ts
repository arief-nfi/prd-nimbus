import { z } from 'zod';

/**
 * VR-029: Single File Upload Validation
 * Ensures only one file is processed. If multiple are provided,
 * the system is designed to replace or reject based on business logic.
 * Per requirements, the error message for violation is "|".
 */
export const SingleFileUploadSchema = z.object({
  files: z.array(z.any())
    .min(1, { message: "File is required" })
    .max(1, { message: "|" })
    .nullable()
    .refine((files) => files !== null && files !== undefined, {
      message: "File cannot be null or undefined",
    }),
  warehouseId: z.string().default("WH0001")
});

export type SingleFileUploadInput = z.infer<typeof SingleFileUploadSchema>;