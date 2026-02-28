import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { OrderRepository } from '../../../domain/order-repository';
import { Inject } from '@nestjs/common';
import { MarkOrderInProgress } from '../mark-order-in-progress';

@MessageHandler(CommandMapper.MarkOrderInProgress)
export class MarkOrderInProgressHandler implements IMessageHandler<MarkOrderInProgress> {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: OrderRepository) {
  }

  async handle(command: MarkOrderInProgress): Promise<void> {
    const order = await this.orderRepository.getById(command.id);
    order.markInProgress();
    await this.orderRepository.store(order);
  }
}
