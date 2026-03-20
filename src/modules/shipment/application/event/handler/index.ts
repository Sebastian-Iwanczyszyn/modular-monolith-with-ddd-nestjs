import { CancelShipmentOnOrderCancelledHandler } from './cancel-shipment-on-order-cancelled.handler';
import { CreateShipmentOnOrderPaidHandler } from './create-shipment-on-order-paid.handler';

export const ShipmentEventHandlers = [
  CreateShipmentOnOrderPaidHandler,
  CancelShipmentOnOrderCancelledHandler,
];
