import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseOrderSchema, PurchaseOrderInput } from '../../../shared/validation/purchase-order.schema';

export const usePurchaseOrderForm = (defaultValues?: Partial<PurchaseOrderInput>) => {
  return useForm<PurchaseOrderInput>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poDate: new Date(),
      requiredDate: new Date(),
      items: [],
      ...defaultValues
    },
    mode: 'onChange'
  });
};