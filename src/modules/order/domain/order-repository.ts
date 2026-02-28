import { Order } from './order';

export interface OrderRepository {
  store(order: Order): Promise<void>;

  getById(id: string): Promise<Order>;
}

export const OrderRepository = Symbol('OrderRepository');
