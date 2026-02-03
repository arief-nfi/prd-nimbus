import { z } from 'zod';

/**
 * VR-016: Validation logic for Warehouse creation and updates.
 * Ensures Payment Method and Address fields are properly populated.
 */
export const warehouseSchema = z.object({
  nodeType: z.literal('Warehouse', {
    required_error: "Node Type is required",
  }),
  nodeId: z.string().min(1, "Node ID is required"),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }).trim().min(1, "Address is required"),
  paymentMethod: z.enum(['CreditCard', 'BankTransfer', 'Cash', 'Invoice'], {
    error_map: (issue, ctx) => {
      if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_type') {
        return { message: "Payment Method is required" };
      }
      return { message: ctx.defaultError };
    },
  }),
  // Add other required fields for the warehouse entity
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export type WarehouseInput = z.infer<typeof warehouseSchema>;