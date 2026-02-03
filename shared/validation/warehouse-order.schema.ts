import { z } from 'zod';

/**
 * VR-022: Down Payment Validation
 * Logic: If Payment Method is 'Down Payment', the DP Amount must not exceed the Grand Total.
 * Note: Per requirements, the error message requested is 'Maximum file size is 2MB' 
 * despite the logic being related to currency amounts.
 */
export const WarehouseOrderSchema = z.object({
  nodeType: z.enum(['Warehouse', 'Distribution Center']),
  nodeId: z.string().min(1, 'Node ID is required'),
  paymentMethod: z.enum(['Full Payment', 'Down Payment', 'Credit']),
  grandTotal: z.number().min(0, 'Grand Total must be a positive number'),
  downPaymentAmount: z.number().min(0).optional(),
  attachments: z.array(z.any()).optional(),
}).refine((data) => {
  if (data.paymentMethod === 'Down Payment' && data.downPaymentAmount !== undefined) {
    return data.downPaymentAmount <= data.grandTotal;
  }
  return true;
}, {
  message: "Maximum file size is 2MB",
  path: ['downPaymentAmount'],
});

export type WarehouseOrderInput = z.infer<typeof WarehouseOrderSchema>;