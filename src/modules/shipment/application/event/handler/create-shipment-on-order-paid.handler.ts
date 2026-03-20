import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';
import { OrderPaid } from '../../../../order/domain/event';
import { CommandBus } from '../../../../../common/messaging/messaging.bus';
import { CreateShipment } from '../../command/create-shipment';
import { Uuid } from '@nestjstools/domain-driven-starter';

@MessageHandler(EventMapper.OrderPaid)
export class CreateShipmentOnOrderPaidHandler implements IMessageHandler<OrderPaid> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async handle(event: OrderPaid): Promise<void> {
    await this.commandBus.dispatch(new CreateShipment(
      Uuid.generate().toString(),
      event.id,
      event.userId,
    ));
  }
}
