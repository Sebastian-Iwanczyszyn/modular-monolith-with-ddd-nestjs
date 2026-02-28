import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CreateOrder } from '../create-order';
import { CommandMapper } from '../../../../../message-mapper';
import { OrderRepository } from '../../../domain/order-repository';
import { Inject } from '@nestjs/common';
import { Order } from '../../../domain/order';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { Amount } from '../../../domain/value-object/amount';
import { IntegrationEventBus } from '../../../../../common/messaging/messaging.bus';
import { OrderCreatedIntegrationEvent } from '@lib/event';

@MessageHandler(CommandMapper.CreateOrder)
export class CreateOrderHandler implements IMessageHandler<CreateOrder> {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: OrderRepository,
    private readonly internalEventBus: IntegrationEventBus,
  ) {
  }

  async handle(command: CreateOrder): Promise<void> {
    const order = Order.create(
      Uuid.fromString(command.id),
      Uuid.fromString(command.productId),
      Amount.create(command.amount),
      Uuid.fromString(command.userId),
      new Date(),
    );
    const snapshot = order.toSnapshot();
    await this.orderRepository.store(order);
    await this.internalEventBus.dispatch(
      new OrderCreatedIntegrationEvent(
        order.id.toString(),
        snapshot.productId,
        snapshot.userId,
        snapshot.amount,
      ),
    );
  }
}
