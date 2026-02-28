import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, Snapshot } from '../../domain/payment';
import { PaymentRepository } from '../../domain/payment-repository';
import { PaymentSchema } from './payment.schema';
import { DomainEventBus } from '../../../../common/messaging/messaging.bus';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentSchema) private readonly repository: Repository<Snapshot>,
    private readonly eventBus: DomainEventBus,
  ) {
  }

  async getById(id: string): Promise<Payment> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) {
      throw new Error(`Payment with id ${id} not found`);
    }

    return Payment.fromSnapshot(entity);
  }

  async store(payment: Payment): Promise<void> {
    await this.repository.save(payment.toSnapshot());
    await this.eventBus.dispatch(payment.popRecordedEvents());
  }
}
