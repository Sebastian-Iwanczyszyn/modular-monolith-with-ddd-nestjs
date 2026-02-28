import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CreatePayment } from '../create-payment';
import { CommandMapper } from '../../../../../message-mapper';
import { PaymentRepository } from '../../../domain/payment-repository';
import { Inject } from '@nestjs/common';
import { Payment } from '../../../domain/payment';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { Amount } from '../../../domain/value-object/amount';
import { ExternalPaymentVendor } from '../../../domain/external-payment-vendor';

@MessageHandler(CommandMapper.CreatePayment)
export class CreatePaymentHandler implements IMessageHandler<CreatePayment> {
  constructor(
    @Inject(PaymentRepository) private readonly paymentRepository: PaymentRepository,
    @Inject(ExternalPaymentVendor) private readonly externalPaymentVendor: ExternalPaymentVendor,
  ) {
  }

  async handle(command: CreatePayment): Promise<void> {
    const payment = await Payment.create(
      Uuid.fromString(command.id),
      Amount.create(command.amount),
      Uuid.fromString(command.orderId),
      Uuid.fromString(command.userId),
      new Date(),
      this.externalPaymentVendor,
    );
    await this.paymentRepository.store(payment);
  }
}
