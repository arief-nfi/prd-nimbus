import { z } from 'zod';

export enum StatusEnum {
  Active = 'Active',
  Inactive = 'Inactive'
}

export const UomStatusSchema = z.nativeEnum(StatusEnum);

export const ItemUomSelectionSchema = z.object({
  uomId: z.string().uuid({ message: 'Invalid UOM identifier' }),
  uomStatus: z.literal(StatusEnum.Active, {
    errorMap: () => ({ message: 'Item UOM dropdown SHALL only display UOMs with status = Active.' })
  })
});

export const DeactivateUomSchema = z.object({
  id: z.string().uuid(),
  activeItemCount: z.number().int().min(0)
}).refine((data) => data.activeItemCount === 0, {
  message: 'Cannot deactivate UOM: Currently used by active item(s).',
  path: ['activeItemCount']
});