import { z } from 'zod';

export const SEQUENCE_LIMITS = {
  NODE: 9999,
  UOM: 999,
  SKU: 9999,
  PO: 999,
} as const;

export const validateSequenceRange = (entity: keyof typeof SEQUENCE_LIMITS, currentSequence: number) => {
  const limit = SEQUENCE_LIMITS[entity];
  if (currentSequence > limit) {
    throw new Error(`Maximum sequence reached for ${entity}. Contact administrator.`);
  }
  return true;
};

/**
 * Zod refinement for checking ID sequence format and range
 * Used in DTO validation
 */
export const createSequenceSchema = (entity: keyof typeof SEQUENCE_LIMITS) => {
  const limit = SEQUENCE_LIMITS[entity];
  const regex = new RegExp(`^[A-Z]+0*([1-9][0-9]*)$`);

  return z.string().refine((val) => {
    const match = val.match(regex);
    if (!match) return false;
    const seqValue = parseInt(match[1], 10);
    return seqValue <= limit;
  }, {
    message: `Maximum sequence reached for ${entity}. Contact administrator.`
  });
};