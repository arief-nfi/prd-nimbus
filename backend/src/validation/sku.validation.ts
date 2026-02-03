import { z } from 'zod';

/**
 * VR-003: SKU generation SHALL be deterministic based on input + sequence.
 * This schema validates the input required for deterministic SKU generation.
 */
export const SkuGenerationSchema = z.object({
  nodeId: z.string({
    required_error: "Node ID is required",
    invalid_type_error: "Node ID must be a string",
  })
  .trim()
  .min(1, "Node ID cannot be empty")
  .regex(/^[A-Z]{2,4}\d{4,6}$/, "Node ID must follow pattern (e.g., WH0001)"),
  
  nodeType: z.enum(['Warehouse', 'Store', 'DistributionCenter'], {
    required_error: "Node Type is required",
  }),

  sequence: z.number({
    required_error: "Sequence is required",
    invalid_type_error: "Sequence must be a number",
  })
  .int("Sequence must be an integer")
  .nonnegative("Sequence cannot be negative"),

  categoryCode: z.string()
    .length(3, "Category code must be exactly 3 characters")
    .regex(/^[A-Z0-9]+$/, "Category code must be alphanumeric")
    .optional()
    .nullable(),
});

export type SkuGenerationInput = z.infer<typeof SkuGenerationSchema>;

/**
 * Helper to generate deterministic SKU based on validated input
 * Format: [NodeTypePrefix]-[NodeID]-[Category]-[Sequence]
 */
export const generateDeterministicSku = (input: SkuGenerationInput): string => {
  const prefix = input.nodeType.substring(0, 2).toUpperCase();
  const category = (input.categoryCode || 'GEN').toUpperCase();
  const paddedSequence = input.sequence.toString().padStart(6, '0');
  
  return `${prefix}-${input.nodeId}-${category}-${paddedSequence}`;
};