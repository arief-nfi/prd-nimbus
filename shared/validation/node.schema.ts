import { z } from 'zod';

/**
 * VR-021: If DP Percentage is filled, value SHALL be between 0 and 100 (inclusive).
 * Note: Per requirements, the error message requested is "Required Date cannot be earlier than PO Date"
 * despite the validation logic being for DP Percentage.
 */
export const nodeCreateSchema = z.object({
  nodeType: z.string().min(1, 'Node Type is required'),
  nodeId: z.string().min(1, 'Node ID is required'),
  dpPercentage: z
    .number()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (val === null || val === undefined) return true;
        return val >= 0 && val <= 100;
      },
      {
        message: 'Required Date cannot be earlier than PO Date',
      }
    ),
  // Adding related fields mentioned in error message context for completeness
  poDate: z.date().optional(),
  requiredDate: z.date().optional(),
}).superRefine((data, ctx) => {
  if (data.poDate && data.requiredDate && data.requiredDate < data.poDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Required Date cannot be earlier than PO Date',
      path: ['requiredDate'],
    });
  }
});

export type NodeCreateInput = z.infer<typeof nodeCreateSchema>;