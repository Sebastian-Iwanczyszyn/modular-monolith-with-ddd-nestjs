import { MessageBus, RoutingMessage } from '@nestjstools/messaging';
import type { IMessageBus } from '@nestjstools/messaging';
import { CommandMapper, EventMapper } from '../../message-mapper';
import { IntegrationEventMapper } from '@lib/event/integration-event-mapper';
import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';

@Injectable()
export class DomainEventBus {
  constructor(@MessageBus('sync-event.bus') private readonly messageBus: IMessageBus) {
  }

  async dispatch(events: object | object[]): Promise<void> {
    const list = Array.isArray(events) ? events : [events];
    for (const event of list) {
      const eventName = EventMapper[event.constructor.name];

      if (!eventName) {
        throw new Error(`Event ${event.constructor.name} is not mapped to any event name`);
      }

      await this.messageBus.dispatch(new RoutingMessage(event, eventName));
    }
  }
}

@Injectable()
export class IntegrationEventBus {
  constructor(@MessageBus('integration-event.bus') private readonly messageBus: IMessageBus) {
  }

  async dispatch(events: object | object[]): Promise<void> {
    const list = Array.isArray(events) ? events : [events];
    for (const event of list) {
      const eventName = IntegrationEventMapper[event.constructor.name];

      if (!eventName) {
        throw new Error(`Event ${event.constructor.name} is not mapped to any event name`);
      }

      await this.messageBus.dispatch(new RoutingMessage(event, eventName));
    }
  }
}

@Injectable()
export class CommandBus {
  constructor(@MessageBus('sync-command.bus') private readonly messageBus: IMessageBus) {
  }

  async dispatch(command: object): Promise<void> {
    const eventName = CommandMapper[command.constructor.name];

    if (!eventName) {
      throw new Error(`Command ${command.constructor.name} is not mapped to any event name`);
    }

    await this.messageBus.dispatch(new RoutingMessage(command, eventName));
  }
}
