import { z } from 'zod';

export const listSuppliersSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => Number(val), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100).default(10)),
    sort: z.string().optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
    search: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
});

export type ListSuppliersQuery = z.infer<typeof listSuppliersSchema>['query'];