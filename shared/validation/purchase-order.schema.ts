import { z } from 'zod';

/**
 * VR-005: Date validation for Purchase Orders
 * Ensures Required Date is not earlier than PO Date
 * and validates at least one item is present.
 */
export const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, 'PO Number is required'),
  poDate: z.coerce.date({
    required_error: 'PO Date is required',
    invalid_type_error: 'Invalid PO Date format',
  }),
  requiredDate: z.coerce.date({
    required_error: 'Required Date is required',
    invalid_type_error: 'Invalid Required Date format',
  }),
  supplierId: z.string().uuid('Invalid Supplier ID'),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
  })).min(1, 'At least 1 item is required'),
}).refine((data) => {
  // VR-005 Logic: Required Date cannot be earlier than PO Date
  // Using setHours(0,0,0,0) to compare only dates without time interference
  const po = new Date(data.poDate).setHours(0, 0, 0, 0);
  const req = new Date(data.requiredDate).setHours(0, 0, 0, 0);
  return req >= po;
}, {
  message: 'Required Date cannot be earlier than PO Date',
  path: ['requiredDate'],
});

export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;