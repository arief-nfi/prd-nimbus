import { z } from 'zod';

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYMENT_AFTER_DELIVERY = 'PAYMENT_AFTER_DELIVERY'
}

export const PaymentValidationSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Invalid payment method selected' }),
  }),
  grandTotal: z.number().min(0, 'Grand total must be a positive number'),
  paidAmount: z.number().min(0, 'Paid amount cannot be negative'),
}).superRefine((data, ctx) => {
  // VR-019 Logic: If Payment After Delivery is selected, Paid Amount must be 0
  if (data.paymentMethod === PaymentMethod.PAYMENT_AFTER_DELIVERY) {
    if (data.paidAmount !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Paid Amount must be 0 for Payment After Delivery',
        path: ['paidAmount'],
      });
    }
  }

  // General validation: Paid Amount cannot exceed Grand Total
  if (data.paidAmount > data.grandTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Paid Amount cannot exceed Grand Total',
      path: ['paidAmount'],
    });
  }
});

export type PaymentValidationInput = z.infer<typeof PaymentValidationSchema>;