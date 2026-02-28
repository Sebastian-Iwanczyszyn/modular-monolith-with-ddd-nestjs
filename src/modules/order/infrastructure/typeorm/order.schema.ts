import { EntitySchema } from 'typeorm';
import { Snapshot } from '../../domain/order';
import { OrderState } from '../../domain/value-object/order-state';

export type OrderRecord = Snapshot;

export const OrderSchema = new EntitySchema<OrderRecord>({
  name: 'orders',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    productId: {
      type: 'uuid',
    },
    amount: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    state: {
      type: 'enum',
      enum: OrderState,
    },
    userId: {
      type: 'uuid',
    },
  },
});
