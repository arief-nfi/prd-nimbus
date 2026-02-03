import { z } from 'zod';

export enum PaymentType {
  ADVANCE_PAYMENT = 'ADVANCE_PAYMENT',
  PAYMENT_AFTER_DELIVERY = 'PAYMENT_AFTER_DELIVERY',
  PARTIAL_PAYMENT = 'PARTIAL_PAYMENT'
}

/**
 * VR-018: Validation for Payment Amounts based on Payment Type
 * Rule: For Advance Payment, Paid Amount must equal Grand Total.
 * Rule: Paid Amount cannot exceed Grand Total regardless of type.
 */
export const paymentValidationSchema = z.object({
  paymentType: z.nativeEnum(PaymentType, {
    errorMap: () => ({ message: "Please select a valid payment type" }),
  }),
  grandTotal: z.number().min(0, "Grand Total must be a positive number"),
  paidAmount: z.number().min(0, "Paid Amount cannot be negative"),
}).superRefine((data, ctx) => {
  const { paymentType, grandTotal, paidAmount } = data;

  // VR-018 specific logic for Advance Payment
  if (paymentType === PaymentType.ADVANCE_PAYMENT) {
    if (paidAmount !== grandTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paid Amount must equal Grand Total for Advance Payment",
        path: ["paidAmount"],
      });
    }
  }

  // General constraint: Paid Amount cannot exceed Grand Total
  if (paidAmount > grandTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paid Amount cannot exceed Grand Total",
      path: ["paidAmount"],
    });
  }

  // B-VR-019 Logic: Payment After Delivery must be 0
  if (paymentType === PaymentType.PAYMENT_AFTER_DELIVERY && paidAmount !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paid Amount must be 0 for Payment After Delivery",
      path: ["paidAmount"],
    });
  }
});

export type PaymentValidationInput = z.infer<typeof paymentValidationSchema>;