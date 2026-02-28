import { CompletePaymentHandler } from './complete-payment.handler';
import { CreatePaymentHandler } from './create-payment.handler';
import { FailPaymentHandler } from './fail-payment.handler';

export const CommandHandlers = [
  CreatePaymentHandler,
  CompletePaymentHandler,
  FailPaymentHandler,
];
