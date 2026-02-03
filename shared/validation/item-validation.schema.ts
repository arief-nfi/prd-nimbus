import { z } from 'zod';

/**
 * VR-007: Validation logic for submission items
 * Ensures that at least one item exists in the collection before processing.
 */
export const ItemSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().min(1, 'SKU is required'),
  brand: z.string().nullable().optional(),
  name: z.string().min(1, 'Name is required'),
  uomId: z.string().uuid('Invalid UOM selection'),
  status: z.string().optional(),
});

export const SubmissionSchema = z.object({
  items: z.array(ItemSchema)
    .min(1, { message: "At least 1 item is required" })
    .refine((items) => items.length > 0, {
      message: "Cannot delete last item. Minimum 1 item required",
    }),
  // Add other submission fields as necessary
});

export type ItemInput = z.infer<typeof ItemSchema>;
export type SubmissionInput = z.infer<typeof SubmissionSchema>;