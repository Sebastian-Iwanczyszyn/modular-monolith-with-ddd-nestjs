import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { PaymentRepository } from '../../../domain/payment-repository';
import { Inject } from '@nestjs/common';
import { CompletePayment } from '../complete-payment';
import { IntegrationEventBus } from '../../../../../common/messaging/messaging.bus';
import { PaymentCompletedIntegrationEvent } from '@lib/event';

@MessageHandler(CommandMapper.CompletePayment)
export class CompletePaymentHandler implements IMessageHandler<CompletePayment> {
  constructor(
    @Inject(PaymentRepository) private readonly paymentRepository: PaymentRepository,
    private readonly integrationEventBus: IntegrationEventBus,
  ) {
  }

  async handle(command: CompletePayment): Promise<void> {
    const payment = await this.paymentRepository.getById(command.id);
    payment.complete();
    await this.paymentRepository.store(payment);
    await this.integrationEventBus.dispatch(new PaymentCompletedIntegrationEvent(
      payment.id.toString(),
      payment.toSnapshot().orderId,
    ));
  }
}
