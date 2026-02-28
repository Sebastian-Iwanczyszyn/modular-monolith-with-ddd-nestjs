import { Global, Module } from '@nestjs/common';
import { InMemoryChannelConfig, MessagingModule } from '@nestjstools/messaging';
import { CommandBus, DomainEventBus, IntegrationEventBus } from './messaging.bus';
import { WebsocketTraceMiddleware } from './websocket-trace.middleware';
import { RxjsNotifier } from './rxjs.notifier';
import {
  ExchangeType,
  MessagingRabbitmqExtensionModule,
  RmqChannelConfig,
} from '@nestjstools/messaging-rabbitmq-extension';
import { Environemnt } from '../../environemnt';

@Global()
@Module({
  imports: [
    MessagingRabbitmqExtensionModule,
    MessagingModule.forRoot({
      buses: [{
        name: 'sync-command.bus',
        channels: ['sync-command.channel'],
      }, {
        name: 'sync-event.bus',
        channels: ['sync-event.channel'],
      }, {
        name: 'integration-event.bus',
        channels: ['integration-event.channel'],
      }],
      channels: [
        new InMemoryChannelConfig({
          name: 'sync-command.channel',
          middlewares: [WebsocketTraceMiddleware],
        }),
        new InMemoryChannelConfig({
          name: 'sync-event.channel',
          avoidErrorsForNotExistedHandlers: true,
          middlewares: [WebsocketTraceMiddleware],
        }),
        new RmqChannelConfig({
          name: 'integration-event.channel',
          avoidErrorsForNotExistedHandlers: true,
          middlewares: [WebsocketTraceMiddleware],
          queue: 'integration-event-queue',
          exchangeType: ExchangeType.TOPIC,
          exchangeName: 'event.exchange',
          bindingKeys: ['*.integration-event.#'],
          connectionUri: Environemnt.RABBITMQ_CONNECTION_URL,
        }),
      ],
      debug: true,
    }),
  ],
  providers: [
    CommandBus,
    IntegrationEventBus,
    DomainEventBus,
    WebsocketTraceMiddleware,
    RxjsNotifier
  ],
  exports: [
    RxjsNotifier,
    CommandBus,
    IntegrationEventBus,
    DomainEventBus,
  ],
})
export class MessagingWrapperModule {
}
