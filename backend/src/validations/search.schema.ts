import { z } from 'zod';

/**
 * VR-010: Search Sensitivity Validation
 * Ensures search queries are valid strings and provides a standardized schema
 * for case-insensitive partial matching across Master Data modules.
 */
export const SearchQuerySchema = z.object({
  query: z.string()
    .trim()
    .min(1, { message: "Search query cannot be empty" })
    .max(100, { message: "Search query is too long" })
    .transform((val) => val.toLowerCase()),
  limit: z.number().int().positive().optional().default(50),
  offset: z.number().int().nonnegative().optional().default(0)
});

export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;