import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';

@MessageHandler(EventMapper.OrderCreated)
export class LogOrderCreatedHandler implements IMessageHandler<unknown> {
  async handle(_: unknown): Promise<void> {
    // TODO: implement order created event handling
  }
}
