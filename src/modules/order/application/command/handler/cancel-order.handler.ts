import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { OrderRepository } from '../../../domain/order-repository';
import { Inject } from '@nestjs/common';
import { CancelOrder } from '../cancel-order';

@MessageHandler(CommandMapper.CancelOrder)
export class CancelOrderHandler implements IMessageHandler<CancelOrder> {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: OrderRepository) {
  }

  async handle(command: CancelOrder): Promise<void> {
    const order = await this.orderRepository.getById(command.id);
    order.cancel();
    await this.orderRepository.store(order);
  }
}
