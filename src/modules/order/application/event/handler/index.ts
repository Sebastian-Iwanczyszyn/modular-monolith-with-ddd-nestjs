import { MarkOrderPaidOnPaymentCompletedHandler } from './mark-order-paid-on-payment-completed.handler';
import { MarkOrderReadyToShipOnOrderPaidHandler } from './mark-order-ready-to-ship-on-order-paid.handler';
import { LogOrderCreatedHandler } from './log-order-created.handler';

export const OrderEventHandlers = [
  LogOrderCreatedHandler,
  MarkOrderPaidOnPaymentCompletedHandler,
  MarkOrderReadyToShipOnOrderPaidHandler,
];
