import { MarkOrderPaidOnPaymentCompletedHandler } from './mark-order-paid-on-payment-completed.handler';
import { MarkOrderReadyToShipOnOrderPaidHandler } from './mark-order-ready-to-ship-on-order-paid.handler';

export const OrderEventHandlers = [
  MarkOrderPaidOnPaymentCompletedHandler,
  MarkOrderReadyToShipOnOrderPaidHandler,
];
