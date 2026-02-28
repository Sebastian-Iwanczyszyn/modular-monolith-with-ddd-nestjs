import { CancelOrderHandler } from './cancel-order.handler';
import { CompleteOrderHandler } from './complete-order.handler';
import { CreateOrderHandler } from './create-order.handler';
import { MarkOrderPaidHandler } from './mark-order-paid.handler';
import { MarkOrderInProgressHandler } from './mark-order-in-progress.handler';

export const OrderCommandHandlers = [
  CreateOrderHandler,
  MarkOrderPaidHandler,
  MarkOrderInProgressHandler,
  CompleteOrderHandler,
  CancelOrderHandler,
];
