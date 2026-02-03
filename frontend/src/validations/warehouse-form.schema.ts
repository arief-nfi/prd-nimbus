import { z } from 'zod';

/**
 * VR-010 Client-side Validation
 * Implements the logic for Item selection and the mandatory error message for amount mismatch.
 */
export const WarehouseItemSchema = z.object({
  itemId: z.string().uuid("Please select a valid item from the list"),
  paidAmount: z.coerce.number(),
  grandTotal: z.coerce.number(),
}).superRefine((data, ctx) => {
  if (data.paidAmount !== data.grandTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "if Paid Amount ≠ Grand Total.",
      path: ["paidAmount"],
    });
  }
});

export type WarehouseItemFormData = z.infer<typeof WarehouseItemSchema>;