import { Prisma } from '@prisma/client';

/**
 * Utility to generate Prisma filter for VR-010
 * Supports case-insensitive partial matching (substring search)
 */
export const getSearchFilter = (field: string, query: string): Prisma.Sql | object => {
  if (!query) return {};

  return {
    [field]: {
      contains: query,
      mode: 'insensitive',
    },
  };
};

/**
 * Specialized helper for Node IDs (e.g., WH0001) to handle complex partial matching
 * like 'wh01' matching 'WH0001'
 */
export const getNodeSearchFilter = (query: string) => {
  const sanitized = query.replace(/[^a-zA-Z0-9]/g, '');
  
  // For VR-010 example: 'wh01' matching 'WH0001'
  // We split the alpha and numeric parts if possible to create a more flexible 'contains'
  const alphaPart = sanitized.match(/[a-zA-Z]+/)?.[0] || '';
  const numericPart = sanitized.match(/[0-9]+/)?.[0] || '';

  return {
    AND: [
      { nodeId: { contains: alphaPart, mode: 'insensitive' } },
      { nodeId: { contains: numericPart, mode: 'insensitive' } }
    ]
  };
};