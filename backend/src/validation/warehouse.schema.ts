import { z } from 'zod';

/**
 * VR-021: Down Payment Validation Schema
 * Handles validation for DP Percentage and DP Amount constraints.
 */
export const warehouseOrderSchema = z.object({
  nodeType: z.enum(['Warehouse', 'DistributionCenter']),
  nodeId: z.string().min(1, 'Node ID is required'),
  paymentType: z.enum(['Full Payment', 'Down Payment', 'Credit']),
  grandTotal: z.number().min(0, 'Grand Total must be a positive number'),
  dpPercentage: z.number().optional().nullable(),
  dpAmount: z.number().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.paymentType === 'Down Payment') {
    // VR-021: DP Percentage must be between 0-100
    if (data.dpPercentage !== undefined && data.dpPercentage !== null) {
      if (data.dpPercentage < 0 || data.dpPercentage > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'DP Percentage must be between 0-100',
          path: ['dpPercentage'],
        });
      }
    }

    // B-VR-022: DP Amount cannot exceed Grand Total
    if (data.dpAmount !== undefined && data.dpAmount !== null) {
      if (data.dpAmount > data.grandTotal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'DP Amount cannot exceed Grand Total',
          path: ['dpAmount'],
        });
      }
    }

    // Ensure values are present if Down Payment is selected
    if (data.dpAmount === null && data.dpPercentage === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DP Amount or Percentage is required for Down Payment',
        path: ['dpAmount'],
      });
    }
  }
});

export type WarehouseOrderInput = z.infer<typeof warehouseOrderSchema>;