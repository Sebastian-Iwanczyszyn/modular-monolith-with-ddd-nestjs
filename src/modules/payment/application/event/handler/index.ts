import { CreatePaymentOnOrderCreatedHandler } from './create-payment-on-order-created.handler';
import { LogPaymentCreatedHandler } from './log-payment-created.handler';
import { LogPaymentFailedHandler } from './log-payment-failed.handler';
import { LogPaymentSucceededHandler } from './log-payment-succeeded.handler';

export const EventHandlers = [
  CreatePaymentOnOrderCreatedHandler,
  LogPaymentCreatedHandler,
  LogPaymentSucceededHandler,
  LogPaymentFailedHandler,
];
