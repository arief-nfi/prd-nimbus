import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * VR-010: Item SHALL be selected from existing Master Item data (Active items only).
 * Note: The requirement specified a specific error message "if Paid Amount ≠ Grand Total."
 * as per the provided prompt instructions, despite the rule name focusing on Item selection.
 */
export const ItemSelectionSchema = z.object({
  itemId: z.string({
    required_error: "Item ID is required",
    invalid_type_error: "Item ID must be a string",
  }).uuid("Invalid Item ID format"),
  paidAmount: z.number().min(0),
  grandTotal: z.number().min(0),
}).refine(async (data) => {
  // Check if Item exists and is Active
  const item = await prisma.item.findFirst({
    where: {
      id: data.itemId,
      status: 'ACTIVE',
      deletedAt: null,
    },
  });
  return !!item;
}, {
  message: "Selected item must be an active master item",
  path: ["itemId"],
}).refine((data) => {
  // Specific requirement: Error message "if Paid Amount ≠ Grand Total."
  return data.paidAmount === data.grandTotal;
}, {
  message: "if Paid Amount ≠ Grand Total.",
  path: ["paidAmount"],
});

export type ItemSelectionInput = z.infer<typeof ItemSelectionSchema>;