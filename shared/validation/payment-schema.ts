import { z } from 'zod';

export enum PaymentType {
  DOWN_PAYMENT = 'DOWN_PAYMENT',
  FULL_PAYMENT = 'FULL_PAYMENT',
  INSTALLMENT = 'INSTALLMENT'
}

export const paymentValidationSchema = z.object({
  paymentType: z.nativeEnum(PaymentType, {
    errorMap: () => ({ message: "Invalid payment type selected" }),
  }),
  grandTotal: z.number().min(0, "Grand total cannot be negative"),
  dpPercentage: z.number()
    .min(0, "DP Percentage must be between 0-100")
    .max(100, "DP Percentage must be between 0-100")
    .optional(),
  dpAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),
}).superRefine((data, ctx) => {
  if (data.paymentType === PaymentType.DOWN_PAYMENT) {
    // VR-020: Paid Amount must be greater than 0 for Down Payment
    if (!data.paidAmount || data.paidAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paid Amount must be greater than 0 for Down Payment",
        path: ["paidAmount"],
      });
    }

    // Requirement: DP Percentage validation
    if (data.dpPercentage === undefined || data.dpPercentage < 0 || data.dpPercentage > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DP Percentage must be between 0-100",
        path: ["dpPercentage"],
      });
    }
  }
});

export type PaymentValidationInput = z.infer<typeof paymentValidationSchema>;