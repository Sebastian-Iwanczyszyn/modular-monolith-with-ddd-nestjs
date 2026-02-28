import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { OrderRepository } from '../../../domain/order-repository';
import { Inject } from '@nestjs/common';
import { MarkOrderPaid } from '../mark-order-paid';

@MessageHandler(CommandMapper.MarkOrderPaid)
export class MarkOrderPaidHandler implements IMessageHandler<MarkOrderPaid> {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: OrderRepository) {
  }

  async handle(command: MarkOrderPaid): Promise<void> {
    const order = await this.orderRepository.getById(command.id);
    order.markPaid();
    await this.orderRepository.store(order);
  }
}
