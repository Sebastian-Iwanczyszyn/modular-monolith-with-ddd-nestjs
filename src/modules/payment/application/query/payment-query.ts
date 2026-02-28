export interface PaymentReadModel {
  id: string;
  order_id: string;
  amount: string;
  state: string;
}

export interface PaymentQuery {
  getByOrderId(orderId: string): Promise<PaymentReadModel>;
}

export const PaymentQuery = 'PaymentQuery';
