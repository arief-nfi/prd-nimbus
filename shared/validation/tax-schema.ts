import { z } from 'zod';

/**
 * VR-013: Validation for Tax Percentage and Payment Method
 * Handles conditional validation when 'applyTax' is selected
 */
export const TaxValidationSchema = z.object({
  applyTax: z.boolean().default(false),
  taxPercentage: z.number().nullable().optional(),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  uomCode: z.string().max(10, "UOM Code must be maximum 10 characters")
}).superRefine((data, ctx) => {
  if (data.applyTax) {
    // VR-013: Tax Percentage must be between 0-100
    if (data.taxPercentage === null || data.taxPercentage === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tax Percentage is required when Apply Tax is selected",
        path: ['taxPercentage'],
      });
    } else if (data.taxPercentage < 0 || data.taxPercentage > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tax Percentage must be between 0-100",
        path: ['taxPercentage'],
      });
    }

    // Requirement specifically asks for this error message on violation
    if (!data.paymentMethod || data.paymentMethod.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment Method is required",
        path: ['paymentMethod'],
      });
    }
  }
});

export type TaxValidationInput = z.infer<typeof TaxValidationSchema>;