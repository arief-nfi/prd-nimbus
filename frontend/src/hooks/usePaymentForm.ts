import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentValidationSchema, PaymentValidationInput, PaymentType } from '../../../shared/validation/payment-schema';

export const usePaymentForm = (initialGrandTotal: number) => {
  const form = useForm<PaymentValidationInput>({
    resolver: zodResolver(paymentValidationSchema),
    defaultValues: {
      paymentType: PaymentType.FULL_PAYMENT,
      grandTotal: initialGrandTotal,
      dpPercentage: 0,
      dpAmount: 0,
      paidAmount: 0
    }
  });

  const watchPaymentType = form.watch('paymentType');
  const watchGrandTotal = form.watch('grandTotal');

  const handleDpPercentageChange = (percentage: number) => {
    const amount = (percentage / 100) * watchGrandTotal;
    form.setValue('dpPercentage', percentage, { shouldValidate: true });
    form.setValue('dpAmount', amount);
    // B-FR-025e: Paid Amount auto-fills to DP Amount
    form.setValue('paidAmount', amount, { shouldValidate: true });
  };

  return {
    form,
    handleDpPercentageChange,
    isDownPayment: watchPaymentType === PaymentType.DOWN_PAYMENT
  };
};