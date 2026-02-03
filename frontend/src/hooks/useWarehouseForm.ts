import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { warehouseSchema, WarehouseInput } from '../../../backend/src/validations/warehouse.schema';

/**
 * Hook for managing Warehouse form state and validation.
 * Implements VR-016 for client-side feedback.
 */
export const useWarehouseForm = (defaultValues?: Partial<WarehouseInput>) => {
  return useForm<WarehouseInput>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      nodeType: 'Warehouse',
      address: '',
      paymentMethod: undefined,
      ...defaultValues,
    },
    mode: 'onTouched',
  });
};