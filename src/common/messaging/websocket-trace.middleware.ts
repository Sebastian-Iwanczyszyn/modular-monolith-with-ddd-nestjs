import { MessagingMiddleware, Middleware, MiddlewareContext, RoutingMessage } from '@nestjstools/messaging';
import { Injectable } from '@nestjs/common';
import { Notification, RxjsNotifier } from './rxjs.notifier';

function hasUserId(x: unknown): x is { userId?: string } {
  return typeof x === 'object' && x !== null && 'userId' in x;
}

@MessagingMiddleware()
@Injectable()
export class WebsocketTraceMiddleware implements Middleware {
  constructor(private readonly notifier: RxjsNotifier<Notification>) {}

  async process(message: RoutingMessage, context: MiddlewareContext): Promise<MiddlewareContext> {
    const payload = message.message as unknown;

    const userId =
      hasUserId(payload) && typeof payload.userId === 'string'
        ? payload.userId
        : undefined;

    if (userId) {
      this.notifier.notify(new Notification(message.messageRoutingKey, userId));
    }

    return context.next().process(message, context);
  }
}
