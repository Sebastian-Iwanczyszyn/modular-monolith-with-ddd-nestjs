import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';

@MessageHandler(EventMapper.PaymentFailed)
export class LogPaymentFailedHandler implements IMessageHandler<unknown> {
  async handle(_: unknown): Promise<void> {
    // TODO: implement payment failed event handling
  }
}
