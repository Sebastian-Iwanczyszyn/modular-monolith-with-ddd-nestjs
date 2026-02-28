import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';
import { OrderPaid } from '../../../domain/event';
import { MarkOrderInProgress } from '../../command/mark-order-in-progress';
import { CommandBus } from '../../../../../common/messaging/messaging.bus';

@MessageHandler(EventMapper.OrderPaid)
export class MarkOrderReadyToShipOnOrderPaidHandler implements IMessageHandler<OrderPaid> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async handle(event: OrderPaid): Promise<void> {
    await this.commandBus.dispatch(new MarkOrderInProgress(
      event.id,
    ));
  }
}
