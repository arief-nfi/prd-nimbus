import { z } from 'zod';

/**
 * VR-003: PO ID Lifecycle and Payment Integrity Validation
 * Logic: 
 * 1. PO ID is reactive to PO Date before submission.
 * 2. After submission (status !== 'DRAFT'), PO ID must be immutable.
 * 3. Payment integrity check: Paid Amount must equal Grand Total for finalized orders.
 */

export const PurchaseOrderStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'CANCELLED']);

export const PurchaseOrderSchema = z.object({
  id: z.string().uuid().optional(),
  poId: z.string().min(1, "PO ID is required"),
  poDate: z.date({
    required_error: "PO Date is required",
    invalid_type_error: "Invalid date format",
  }),
  status: PurchaseOrderStatusSchema.default('DRAFT'),
  grandTotal: z.number().min(0, "Grand Total cannot be negative"),
  paidAmount: z.number().min(0, "Paid Amount cannot be negative"),
  nodeType: z.enum(['Warehouse', 'Store', 'DistributionCenter']),
  nodeId: z.string().min(1, "Node ID is required"),
}).refine((data) => {
  // Validation Rule: If status is not DRAFT, ensure payment is complete
  // Based on requirement: Error message "if Paid Amount ≠ Grand Total."
  if (data.status !== 'DRAFT') {
    return data.paidAmount === data.grandTotal;
  }
  return true;
}, {
  message: "if Paid Amount ≠ Grand Total.",
  path: ["paidAmount"],
});

export type PurchaseOrderInput = z.infer<typeof PurchaseOrderSchema>;

/**
 * Validation for updating an existing PO to ensure PO ID immutability
 */
export const UpdatePurchaseOrderSchema = PurchaseOrderSchema.extend({
  originalPoId: z.string(),
  originalStatus: PurchaseOrderStatusSchema,
}).refine((data) => {
  // VR-003: After Submit, PO ID is permanently locked and SHALL NOT change
  if (data.originalStatus !== 'DRAFT') {
    return data.poId === data.originalPoId;
  }
  return true;
}, {
  message: "PO ID is permanently locked after submission and cannot be changed.",
  path: ["poId"],
});