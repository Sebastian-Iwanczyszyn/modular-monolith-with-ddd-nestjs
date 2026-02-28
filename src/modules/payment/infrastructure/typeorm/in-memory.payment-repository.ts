import { PaymentRepository } from '../../domain/payment-repository';
import { Payment } from '../../domain/payment';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InMemoryPaymentRepository implements PaymentRepository {
  private logger = new Logger('InMemoryPaymentRepositories');
  private readonly payments = new Map<string, Payment>();

  getById(id: string): Promise<Payment> {
    const payment = this.payments.get(id);
    if (!payment) {
      return Promise.reject(new Error(`Payment with id ${id} not found`));
    }
    return Promise.resolve(payment);
  }

  store(payment: Payment): Promise<void> {
    const snapshot = payment.toSnapshot();
    this.payments.set(snapshot.id, payment);
    this.logger.log(`InMemoryPaymentRepository stored with id [${snapshot.id}]`);
    return Promise.resolve();
  }
}
