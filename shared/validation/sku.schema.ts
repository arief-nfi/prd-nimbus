import { z } from 'zod';

/**
 * VR-011: SKU Manual Override Policy
 * Pattern: [A-Z]{3}-[0-9]{4}
 * The 3-consonant prefix must be uppercase consonants.
 * Manual overrides are valid as long as they follow the format, 
 * regardless of whether they match the item name logic.
 */

const CONSONANT_REGEX = /^[BCDFGHJKLMNPQRSTVWXYZ]{3}-[0-9]{4}$/;

export const skuSchema = z.string({
  required_error: "SKU is required",
})
.trim()
.toUpperCase()
.regex(CONSONANT_REGEX, {
  message: "SKU must follow the format: 3 uppercase consonants followed by a hyphen and 4 digits (e.g., KMN-0001)"
});

export const itemSchema = z.object({
  id: z.string().uuid().optional(),
  sku: skuSchema,
  brand: z.string().min(1, "Brand is required").nullable().optional(),
  name: z.string().min(1, "Item name is required"),
  uomId: z.string().uuid("Invalid UOM selection"),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export type ItemInput = z.infer<typeof itemSchema>;