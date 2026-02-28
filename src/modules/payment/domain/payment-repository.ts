import { Payment } from './payment';

export interface PaymentRepository {
  store(payment: Payment): Promise<void>;

  getById(id: string): Promise<Payment>;
}

export const PaymentRepository = Symbol('PaymentRepository');
