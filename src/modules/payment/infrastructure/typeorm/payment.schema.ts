import { EntitySchema } from 'typeorm';
import { Snapshot } from '../../domain/payment';
import { PaymentState } from '../../domain/value-object/payment-state';

export const PaymentSchema = new EntitySchema<Snapshot>({
  name: 'payments',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    externalId: {
      type: String,
    },
    amount: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    state: {
      type: 'enum',
      enum: PaymentState,
    },
    orderId: {
      type: 'uuid',
    },
    userId: {
      type: 'uuid',
    },
  },
});
