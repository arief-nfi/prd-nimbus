import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentValidationSchema, PaymentMethod, PaymentValidationInput } from '../../../shared/schemas/payment-validation.schema';

interface PaymentFormProps {
  grandTotal: number;
  onSubmit: (data: PaymentValidationInput) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ grandTotal, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentValidationInput>({
    resolver: zodResolver(PaymentValidationSchema),
    defaultValues: {
      paymentMethod: PaymentMethod.CASH,
      grandTotal: grandTotal,
      paidAmount: 0,
    },
  });

  const selectedPaymentMethod = useWatch({ control, name: 'paymentMethod' });

  // VR-019: Auto-fill to 0 and handle read-only state logic
  useEffect(() => {
    if (selectedPaymentMethod === PaymentMethod.PAYMENT_AFTER_DELIVERY) {
      setValue('paidAmount', 0, { shouldValidate: true });
    }
  }, [selectedPaymentMethod, setValue]);

  const isPaidAmountDisabled = selectedPaymentMethod === PaymentMethod.PAYMENT_AFTER_DELIVERY;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col">
        <label className="font-medium">Payment Method</label>
        <select
          {...register('paymentMethod')}
          className="border p-2 rounded bg-white"
        >
          <option value={PaymentMethod.CASH}>Cash</option>
          <option value={PaymentMethod.CREDIT_CARD}>Credit Card</option>
          <option value={PaymentMethod.PAYMENT_AFTER_DELIVERY}>Payment After Delivery</option>
        </select>
        {errors.paymentMethod && <span className="text-red-500 text-sm">{errors.paymentMethod.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="font-medium">Paid Amount</label>
        <input
          type="number"
          step="0.01"
          readOnly={isPaidAmountDisabled}
          {...register('paidAmount', { valueAsNumber: true })}
          className={`border p-2 rounded ${
            isPaidAmountDisabled ? 'bg-gray-200 cursor-not-allowed text-gray-500' : 'bg-white'
          }`}
        />
        {errors.paidAmount && <span className="text-red-500 text-sm">{errors.paidAmount.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Process Payment
      </button>
    </form>
  );
};