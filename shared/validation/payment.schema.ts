import { z } from 'zod';

/**
 * VR-017: Paid Amount is mandatory field for all payment methods.
 * This schema validates that the paid amount matches the grand total
 * and ensures the field is present regardless of payment method.
 */
export const PaymentValidationSchema = z.object({
  paymentMethod: z.string({
    required_error: "Payment method is required",
  }).min(1, "Payment method is required"),
  grandTotal: z.number({
    required_error: "Grand total is required",
    invalid_type_error: "Grand total must be a number",
  }).min(0, "Grand total cannot be negative"),
  paidAmount: z.number({
    required_error: "Paid Amount is mandatory",
    invalid_type_error: "Paid Amount must be a number",
  }).min(0, "Paid amount cannot be negative"),
}).refine((data) => data.paidAmount === data.grandTotal, {
  message: "if Paid Amount ≠ Grand Total.",
  path: ["paidAmount"],
});

export type PaymentValidationInput = z.infer<typeof PaymentValidationSchema>;