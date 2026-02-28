import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/order';
import { OrderRepository } from '../../domain/order-repository';
import { DomainEventBus } from '../../../../common/messaging/messaging.bus';
import { OrderRecord, OrderSchema } from './order.schema';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderSchema) private readonly repository: Repository<OrderRecord>,
    private readonly eventBus: DomainEventBus,
  ) {
  }

  async getById(id: string): Promise<Order> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Order with id ${id} not found`);
    }

    return Order.fromSnapshot(entity);
  }

  async store(order: Order): Promise<void> {
    await this.repository.save(order.toSnapshot());
    await this.eventBus.dispatch(order.popRecordedEvents());
  }
}
