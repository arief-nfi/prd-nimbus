import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaxValidationSchema, TaxValidationInput } from '../../../shared/validation/tax-schema';

export const useTaxForm = (defaultValues?: Partial<TaxValidationInput>) => {
  return useForm<TaxValidationInput>({
    resolver: zodResolver(TaxValidationSchema),
    defaultValues: {
      applyTax: false,
      taxPercentage: 0,
      paymentMethod: '',
      uomCode: '',
      ...defaultValues
    },
    mode: 'onChange'
  });
};