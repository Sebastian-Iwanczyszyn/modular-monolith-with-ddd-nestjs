export interface OrderReadModel {
  id: string;
  product_id: string;
  user_id: string;
  amount: string;
  state: string;
  created_at: string;
}

export interface OrderQuery {
  getById(id: string): Promise<OrderReadModel>;
}

export const OrderQuery = 'OrderQuery';
