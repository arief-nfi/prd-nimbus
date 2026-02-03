import { z } from 'zod';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * VR-027: Document Upload Validation
 * Rule: Only PDF or Image files are allowed
 * Error: | #DC2626 | #FEF2F2 | #FECACA |
 */
export const documentUploadSchema = z.object({
  file: z.any()
    .refine((file) => file !== null && file !== undefined, {
      message: 'File is required',
    })
    .refine(
      (file) => {
        if (file instanceof File) {
          return ALLOWED_MIME_TYPES.includes(file.type);
        }
        // For server-side Multer objects
        if (typeof file === 'object' && 'mimetype' in file) {
          return ALLOWED_MIME_TYPES.includes(file.mimetype);
        }
        return false;
      },
      {
        message: '| #DC2626 | #FEF2F2 | #FECACA |',
      }
    )
    .refine(
      (file) => {
        const size = file instanceof File ? file.size : file.size;
        return size <= MAX_FILE_SIZE;
      },
      {
        message: 'File size must not exceed 5MB',
      }
    ),
  documentType: z.string().min(1, 'Document type is required'),
  paymentDetails: z.object({
    downPaymentPercentage: z.number().min(0).max(100),
    grandTotal: z.number().min(0),
    dpAmount: z.number().min(0),
    paidAmount: z.number().min(0),
  }).refine((data) => {
    const expectedDp = (data.downPaymentPercentage / 100) * data.grandTotal;
    return Math.abs(data.dpAmount - expectedDp) < 0.01;
  }, {
    message: 'DP Amount must sync with percentage and grand total',
  }),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;