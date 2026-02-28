import { OrderRepository } from '../../domain/order-repository';
import { Order } from '../../domain/order';
import { Injectable } from '@nestjs/common';
import { DomainEventBus } from '../../../../common/messaging/messaging.bus';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();

  constructor(private readonly eventBus: DomainEventBus) {
  }

  getById(id: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) {
      return Promise.reject(new Error(`Order with id ${id} not found`));
    }
    return Promise.resolve(order);
  }

  store(order: Order): Promise<void> {
    const snapshot = order.toSnapshot();
    this.orders.set(snapshot.id, order);
    const events = order.popRecordedEvents();
    const dispatches = events.map((event) => this.eventBus.dispatch(event));
    return Promise.all(dispatches).then(() => undefined);
  }

}
