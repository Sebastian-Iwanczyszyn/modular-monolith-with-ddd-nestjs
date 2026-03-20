import {
  HookMessage,
  LifecycleHook,
  MessagingLifecycleHook,
  MessagingLifecycleHookListener,
} from '@nestjstools/messaging';
import { Injectable } from '@nestjs/common';
import { Notification, RxjsNotifier } from './rxjs.notifier';

function hasUserId(x: unknown): x is { userId?: string } {
  return typeof x === 'object' && x !== null && 'userId' in x;
}

@Injectable()
@MessagingLifecycleHook(LifecycleHook.AFTER_MESSAGE_DENORMALIZED)
export class WebsocketTraceHook implements MessagingLifecycleHookListener {
  constructor(private readonly notifier: RxjsNotifier<Notification>) {}

  hook(message: HookMessage): Promise<void> {
    const payload = message.message as unknown;

    const userId =
      hasUserId(payload) && typeof payload.userId === 'string'
        ? payload.userId
        : undefined;

    if (userId) {
      this.notifier.notify(new Notification(message.routingKey, userId));
    }

    return Promise.resolve();
  }
}
