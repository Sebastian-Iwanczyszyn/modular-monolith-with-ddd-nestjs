import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { OrderRepository } from '../../../domain/order-repository';
import { Inject } from '@nestjs/common';
import { CompleteOrder } from '../complete-order';

@MessageHandler(CommandMapper.CompleteOrder)
export class CompleteOrderHandler implements IMessageHandler<CompleteOrder> {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: OrderRepository) {
  }

  async handle(command: CompleteOrder): Promise<void> {
    const order = await this.orderRepository.getById(command.id);
    order.complete();
    await this.orderRepository.store(order);
  }
}
