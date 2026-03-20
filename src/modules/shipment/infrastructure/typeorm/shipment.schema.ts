import { EntitySchema } from 'typeorm';
import { ShipmentSnapshot } from '../../domain/shipment';
import { ShipmentState } from '../../domain/value-object/shipment-state';

export type ShipmentRecord = ShipmentSnapshot;

export const ShipmentSchema = new EntitySchema<ShipmentRecord>({
  name: 'shipments',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    orderId: {
      type: 'uuid',
      unique: true,
    },
    userId: {
      type: 'uuid',
    },
    createdAt: {
      type: Date,
    },
    state: {
      type: 'enum',
      enum: ShipmentState,
    },
    dispatchedAt: {
      type: Date,
      nullable: true,
    },
    deliveredAt: {
      type: Date,
      nullable: true,
    },
  },
});
