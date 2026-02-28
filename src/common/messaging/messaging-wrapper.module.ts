import { Global, Module } from '@nestjs/common';
import { InMemoryChannelConfig, MessagingModule } from '@nestjstools/messaging';
import { CommandBus, DomainEventBus, IntegrationEventBus } from './messaging.bus';

@Global()
@Module({
  imports: [
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
        }),
        new InMemoryChannelConfig({
          name: 'sync-event.channel',
          avoidErrorsForNotExistedHandlers: true,
        }),
        new InMemoryChannelConfig({
          name: 'integration-event.channel',
          avoidErrorsForNotExistedHandlers: true,
        }),
      ],
      debug: true,
    }),
  ],
  providers: [
    CommandBus,
    IntegrationEventBus,
    DomainEventBus,
  ],
  exports: [
    CommandBus,
    IntegrationEventBus,
    DomainEventBus,
  ],
})
export class MessagingWrapperModule {
}
