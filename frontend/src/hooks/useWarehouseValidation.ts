import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WarehouseSchema, WarehouseInput } from '../../../backend/src/validation/warehouse.schema';

export const useWarehouseForm = (defaultValues?: Partial<WarehouseInput>) => {
  return useForm<WarehouseInput>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: {
      nodeType: 'Warehouse',
      taxOption: '' as any,
      paidAmount: 0,
      grandTotal: 0,
      ...defaultValues
    },
    mode: 'onChange'
  });
};