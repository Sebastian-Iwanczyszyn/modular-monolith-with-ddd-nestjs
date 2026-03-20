import { Inject } from '@nestjs/common';
import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { EmailSentIntegrationEvent, ShipmentCreatedIntegrationEvent } from '@lib/event';
import { IntegrationEventBus } from '../../../common/messaging/messaging.bus';
import { IntegrationEventMapper } from '@lib/event/integration-event-mapper';
import { EmailSender } from '../port/email-sender.port';

@MessageHandler(IntegrationEventMapper.ShipmentCreatedIntegrationEvent)
export class SendShipmentCreatedEmailHandler implements IMessageHandler<ShipmentCreatedIntegrationEvent> {
  constructor(
    @Inject(EmailSender) private readonly emailSender: EmailSender,
    private readonly integrationEventBus: IntegrationEventBus,
  ) {
  }

  async handle(event: ShipmentCreatedIntegrationEvent): Promise<void> {
    const recipient = `user-${event.userId}@example.com`;
    await this.emailSender.send({
      userId: event.userId,
      recipient,
      subject: 'Your shipment has been created',
      body: `Shipment ${event.id} has been created and is waiting for dispatch.`,
    });

    await this.integrationEventBus.dispatch(new EmailSentIntegrationEvent(
      Uuid.generate().toString(),
      event.userId,
      recipient,
      'shipment-created',
    ));
  }
}
