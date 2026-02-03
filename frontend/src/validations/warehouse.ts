import { z } from 'zod';

/**
 * Client-side validation for Warehouse Supplier form
 * Implements VR-004 and the specific error message requirement
 */
export const warehouseFormSchema = z.object({
  nodeType: z.literal('Warehouse'),
  nodeId: z.string().min(1, "Node ID is required"),
  supplierId: z.string().uuid("Please select a valid supplier"),
  paidAmount: z.coerce.number().min(0),
  grandTotal: z.coerce.number().min(0),
}).superRefine((data, ctx) => {
  // Validation logic for TASK-105 requirement: Error message "if Paid Amount ≠ Grand Total."
  if (data.paidAmount !== data.grandTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "if Paid Amount ≠ Grand Total.",
      path: ["paidAmount"],
    });
  }
});

export type WarehouseFormData = z.infer<typeof warehouseFormSchema>;