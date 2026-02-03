import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const WarehouseCreateSchema = z.object({
  nodeType: z.literal('Warehouse'),
  nodeId: z.string().min(1, 'Node ID is required'),
  document: z
    .custom<File | { size: number } | null | undefined>()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= MAX_FILE_SIZE;
      },
      {
        message: 'Document file size SHALL NOT exceed 2MB.',
      }
    )
    .optional(),
  poDate: z.date(),
  requiredDate: z.date(),
}).refine(
  (data) => {
    // Implementation of VR-028 specific error message requirement from prompt
    // Note: The prompt description mentions file size but the error message requirement 
    // specifically asks for "Required Date cannot be earlier than PO Date"
    return data.requiredDate >= data.poDate;
  },
  {
    message: 'Required Date cannot be earlier than PO Date',
    path: ['requiredDate'],
  }
);

export type WarehouseCreateInput = z.infer<typeof WarehouseCreateSchema>;