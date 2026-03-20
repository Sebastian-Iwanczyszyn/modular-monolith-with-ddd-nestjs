export interface ShipmentReadModel {
  id: string;
  order_id: string;
  user_id: string;
  state: string;
  created_at: string;
  dispatched_at?: string;
  delivered_at?: string;
}

export interface ShipmentQuery {
  getById(id: string): Promise<ShipmentReadModel>;

  getByOrderId(orderId: string): Promise<ShipmentReadModel>;
}

export const ShipmentQuery = 'ShipmentQuery';
