import { PrismaClient } from '@prisma/client';
import { PaymentValidationSchema, PaymentValidationInput } from '../../../shared/schemas/payment-validation.schema';

const prisma = new PrismaClient();

export class PaymentService {
  async processPayment(data: PaymentValidationInput) {
    // Server-side validation
    const validationResult = PaymentValidationSchema.safeParse(data);

    if (!validationResult.success) {
      console.error('[VR-019 Validation Failure]:', validationResult.error.format());
      throw new Error(validationResult.error.errors[0].message);
    }

    const validatedData = validationResult.data;

    try {
      return await prisma.payment.create({
        data: {
          method: validatedData.paymentMethod,
          amount: validatedData.paidAmount,
          total: validatedData.grandTotal,
          status: validatedData.paymentMethod === 'PAYMENT_AFTER_DELIVERY' ? 'PENDING' : 'COMPLETED',
        },
      });
    } catch (error) {
      console.error('Database error during payment processing:', error);
      throw new Error('Internal server error');
    }
  }
}