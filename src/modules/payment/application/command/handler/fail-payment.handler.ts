import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { PaymentRepository } from '../../../domain/payment-repository';
import { Inject } from '@nestjs/common';
import { FailPayment } from '../fail-payment';

@MessageHandler(CommandMapper.FailPayment)
export class FailPaymentHandler implements IMessageHandler<FailPayment> {
  constructor(
    @Inject(PaymentRepository) private readonly paymentRepository: PaymentRepository) {
  }

  async handle(command: FailPayment): Promise<void> {
    const payment = await this.paymentRepository.getById(command.id);
    payment.fail();
    await this.paymentRepository.store(payment);
  }
}
