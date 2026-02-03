import { z } from 'zod';

export const warehouseSchema = z.object({
  name: z.string()
    .min(1, 'Warehouse name is required')
    .max(255, 'Warehouse name is too long')
    .trim(),
  nodeId: z.string().min(1, 'Node ID is required'),
  nodeType: z.literal('Warehouse'),
  method: z.enum(['FEFO', 'FIFO', 'LIFO']),
  address: z.string().min(5, 'Valid address is required'),
  description: z.string().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export type WarehouseInput = z.infer<typeof warehouseSchema>;