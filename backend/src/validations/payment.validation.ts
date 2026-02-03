import { z } from 'zod';

export enum PaymentMethod {
  CASH = 'CASH',
  DOWN_PAYMENT = 'DOWN_PAYMENT',
  PAYMENT_AFTER_DELIVERY = 'PAYMENT_AFTER_DELIVERY'
}

export const paymentSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  grandTotal: z.number().min(0),
  paidAmount: z.number().min(0),
  dpPercentage: z.number().min(0).max(100).optional(),
  dpAmount: z.number().min(0).optional(),
}).superRefine((data, ctx) => {
  // VR-019: If Payment After Delivery is selected, Paid Amount must be 0 (read-only logic)
  if (data.paymentMethod === PaymentMethod.PAYMENT_AFTER_DELIVERY) {
    if (data.paidAmount !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paid Amount must be 0 when Payment After Delivery is selected",
        path: ['paidAmount'],
      });
    }
  }

  // Business Rule: Paid Amount cannot exceed Grand Total
  if (data.paidAmount > data.grandTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paid Amount cannot exceed Grand Total",
      path: ['paidAmount'],
    });
  }

  // Validation for Down Payment logic
  if (data.paymentMethod === PaymentMethod.DOWN_PAYMENT) {
    if (data.dpAmount === undefined || data.dpAmount === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DP Amount is required for Down Payment method",
        path: ['dpAmount'],
      });
    }
  }
});

export type PaymentValidationInput = z.infer<typeof paymentSchema>;