import { z } from 'zod';

export const updateSupplierSchema = z.object({
  suppId: z.string().min(1, 'Supplier ID is required'),
  name: z.string().min(1, 'Supplier Name is required'),
  picName: z.string().min(1, 'PIC Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;