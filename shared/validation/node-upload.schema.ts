import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const nodeUploadSchema = z.object({
  nodeId: z.string().min(1, 'Node ID is required'),
  nodeType: z.literal('Warehouse'),
  file: z
    .custom<File | undefined>()
    .refine((file) => !!file, 'File is required')
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      'Unsupported file format. Only PDF or Image (.jpg/.jpeg/.png) are allowed'
    )
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'Maximum file size is 2MB'
    )
});

export type NodeUploadInput = z.infer<typeof nodeUploadSchema>;