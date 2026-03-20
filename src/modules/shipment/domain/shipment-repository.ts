import { Shipment } from './shipment';

export interface ShipmentRepository {
  store(shipment: Shipment): Promise<void>;

  getById(id: string): Promise<Shipment>;

  getByOrderId(orderId: string): Promise<Shipment>;
}

export const ShipmentRepository = Symbol('ShipmentRepository');
