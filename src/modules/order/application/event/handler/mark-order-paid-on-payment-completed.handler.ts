import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { IntegrationEventMapper } from '@lib/event/integration-event-mapper';
import { PaymentCompletedIntegrationEvent } from '@lib/event';
import { MarkOrderInProgress } from '../../command/mark-order-in-progress';
import { CommandBus } from '../../../../../common/messaging/messaging.bus';
import { MarkOrderPaid } from '../../command/mark-order-paid';

@MessageHandler(IntegrationEventMapper.PaymentCompletedIntegrationEvent)
export class MarkOrderPaidOnPaymentCompletedHandler implements IMessageHandler<PaymentCompletedIntegrationEvent> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  async handle(event: PaymentCompletedIntegrationEvent): Promise<void> {
    await this.commandBus.dispatch(new MarkOrderPaid(
      event.orderId,
    ));
  }
}
