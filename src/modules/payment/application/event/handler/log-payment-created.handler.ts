import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';

@MessageHandler(EventMapper.PaymentCreated)
export class LogPaymentCreatedHandler implements IMessageHandler<unknown> {
  async handle(_: unknown): Promise<void> {
    // TODO: implement payment created event handling
  }
}
