import { CancelShipmentHandler } from './cancel-shipment.handler';
import { CreateShipmentHandler } from './create-shipment.handler';
import { DeliverShipmentHandler } from './deliver-shipment.handler';
import { DispatchShipmentHandler } from './dispatch-shipment.handler';

export const ShipmentCommandHandlers = [
  CreateShipmentHandler,
  DispatchShipmentHandler,
  DeliverShipmentHandler,
  CancelShipmentHandler,
];
