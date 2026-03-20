import { Global, Module } from '@nestjs/common';
import { InMemoryChannelConfig, MessagingModule } from '@nestjstools/messaging';
import { CommandBus, DomainEventBus, IntegrationEventBus } from './messaging.bus';
import { WebsocketTraceHook } from './websocket-trace-hook.service';
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
        channels: [!Environemnt.IS_TEST ? 'integration-event.channel' : 'sync-event.channel'],
      }],
      channels: [
        new InMemoryChannelConfig({
          name: 'sync-command.channel',
        }),
        new InMemoryChannelConfig({
          name: 'sync-event.channel',
          avoidErrorsForNotExistedHandlers: true,
        }),
        new RmqChannelConfig({
          name: 'integration-event.channel',
          avoidErrorsForNotExistedHandlers: true,
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
    WebsocketTraceHook,
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
