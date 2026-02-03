import { z } from 'zod';

/**
 * VR-005: Validation for Purchase Order Dates and Item Requirements
 * Business Rule: Required Date must be equal to or greater than PO Date.
 * Also ensures at least one item is present in the order items array.
 */
export const purchaseOrderSchema = z.object({
  poDate: z.coerce.date({
    required_error: "PO Date is required",
    invalid_type_error: "Invalid PO Date format",
  }),
  requiredDate: z.coerce.date({
    required_error: "Required Date is required",
    invalid_type_error: "Invalid Required Date format",
  }),
  items: z.array(z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().positive("Quantity must be greater than 0"),
    price: z.number().nonnegative("Price cannot be negative")
  })).min(1, { message: "At least 1 item is required" }),
  supplierId: z.string().uuid("Invalid Supplier ID"),
  status: z.enum(['DRAFT', 'PENDING', 'COMPLETED']).default('DRAFT'),
}).refine((data) => {
  // VR-005: Required Date must be same day or future relative to PO Date
  // We normalize to start of day for comparison
  const po = new Date(data.poDate).setHours(0, 0, 0, 0);
  const req = new Date(data.requiredDate).setHours(0, 0, 0, 0);
  return req >= po;
}, {
  message: "Required Date cannot be earlier than PO Date",
  path: ["requiredDate"],
});

export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;