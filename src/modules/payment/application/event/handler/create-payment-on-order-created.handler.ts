import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { IntegrationEventMapper } from '@lib/event/integration-event-mapper';
import { OrderCreatedIntegrationEvent } from '@lib/event';
import { CommandBus } from '../../../../../common/messaging/messaging.bus';
import { CreatePayment } from '../../command/create-payment';
import { Uuid } from '@nestjstools/domain-driven-starter';

@MessageHandler(IntegrationEventMapper.OrderCreatedIntegrationEvent)
export class CreatePaymentOnOrderCreatedHandler implements IMessageHandler<OrderCreatedIntegrationEvent> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async handle(event: OrderCreatedIntegrationEvent): Promise<void> {
    await this.commandBus.dispatch(new CreatePayment(
      Uuid.generate().toString(),
      event.id,
      event.userId,
      event.amount,
    ));
  }
}
