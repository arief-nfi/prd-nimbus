import { z } from 'zod';
import { createSequenceSchema } from '../utils/sequence-validator';

export const UomSchema = z.object({
  uomId: createSequenceSchema('UOM'),
  code: z.string().min(1, "Code is required").max(20),
  name: z.string().min(1, "Name is required").max(100),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export type UomInput = z.infer<typeof UomSchema>;