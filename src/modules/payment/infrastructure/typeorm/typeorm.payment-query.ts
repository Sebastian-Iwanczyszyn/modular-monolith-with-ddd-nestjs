import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Snapshot } from '../../domain/payment';
import { PaymentSchema } from './payment.schema';
import { PaymentQuery, PaymentReadModel } from '../../application/query/payment-query';

@Injectable()
export class TypeormPaymentQuery implements PaymentQuery {
  constructor(
    @InjectRepository(PaymentSchema) private readonly repository: Repository<Snapshot>,
  ) {
  }

  async getByOrderId(orderId: string): Promise<PaymentReadModel> {
    return this.repository.createQueryBuilder()
      .from('payments', 'payment')
      .select('*')
      .where('payment.orderId = :orderId', { orderId })
      .getRawOne()
      .then((payment: PaymentReadModel) => {
        if (!payment) {
          throw new Error(`Payment with orderId [${orderId}] not found`);
        }

        return payment;
      });
  }
}
