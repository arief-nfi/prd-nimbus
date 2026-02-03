import { z } from 'zod';

export const updateWarehouseSchema = z.object({
  nodeId: z.string().min(1, 'Node ID is required'),
  name: z.string().min(1, 'Name is required'),
  parentId: z.string().uuid().nullable().optional(),
  nodeType: z.enum(['Warehouse', 'Aisle', 'Rack', 'Bin']),
  method: z.enum(['FIFO', 'LIFO', 'FEFO']),
  address: z.string().min(1, 'Address is required'),
  description: z.string().nullable().optional(),
  status: z.enum(['Active', 'Inactive']),
});

export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;