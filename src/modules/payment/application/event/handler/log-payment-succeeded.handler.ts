import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';

@MessageHandler(EventMapper.PaymentSucceeded)
export class LogPaymentSucceededHandler implements IMessageHandler<unknown> {
  async handle(_: unknown): Promise<void> {
    // TODO: implement payment succeeded event handling
  }
}
