import { z } from 'zod';

/**
 * VR-030: Search Sensitivity validation and PO Schema
 * This schema handles the search parameter validation ensuring it follows
 * the case-insensitive partial matching logic requirements.
 */
export const POSearchSchema = z.object({
  search: z.string().trim().min(1, "Search query cannot be empty").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export const POCreateSchema = z.object({
  poNumber: z.string().min(1, "PO Number is required"),
  vendorName: z.string().min(1, "Vendor Name is required"),
  poDate: z.coerce.date({
    required_error: "PO Date is required",
    invalid_type_error: "Invalid PO Date format",
  }),
  requiredDate: z.coerce.date({
    required_error: "Required Date is required",
    invalid_type_error: "Invalid Required Date format",
  }),
  nodeType: z.enum(['Warehouse', 'Factory', 'Store']),
  nodeId: z.string().min(1, "Node ID is required"),
}).refine((data) => {
  // VR-030 Logic: Required Date cannot be earlier than PO Date
  return data.requiredDate >= data.poDate;
}, {
  message: "Required Date cannot be earlier than PO Date",
  path: ["requiredDate"],
});

export type POSearchInput = z.infer<typeof POSearchSchema>;
export type POCreateInput = z.infer<typeof POCreateSchema>;