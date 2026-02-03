import { z } from 'zod';

export const FormActionsSchema = z.object({
  'b-tc-078': z.string().optional(),
  'b-tc-079': z.string().optional(),
  'b-tc-079a': z.string().optional(),
  'b-tc-079b': z.string().optional(),
  'b-tc-080': z.string().optional(),
});

export type FormActionsValues = z.infer<typeof FormActionsSchema>;