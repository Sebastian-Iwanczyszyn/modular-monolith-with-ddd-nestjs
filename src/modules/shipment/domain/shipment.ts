import { AggregateRoot, Uuid } from '@nestjstools/domain-driven-starter';
import { ShipmentCancelled, ShipmentCreated, ShipmentDelivered, ShipmentDispatched } from './event';
import { ShipmentState } from './value-object/shipment-state';

export class Shipment extends AggregateRoot {
  private constructor(
    id: Uuid,
    private orderId: Uuid,
    private userId: Uuid,
    private createdAt: Date,
    private state: ShipmentState,
    private dispatchedAt?: Date,
    private deliveredAt?: Date,
  ) {
    super(id);
  }

  static create(
    id: Uuid,
    orderId: Uuid,
    userId: Uuid,
    now: Date,
  ): Shipment {
    const shipment = new Shipment(
      id,
      orderId,
      userId,
      now,
      ShipmentState.PENDING,
    );
    shipment.recordEvent(new ShipmentCreated(id.toString(), userId.toString()));
    return shipment;
  }

  static fromSnapshot(snapshot: ShipmentSnapshot): Shipment {
    return new Shipment(
      Uuid.fromString(snapshot.id),
      Uuid.fromString(snapshot.orderId),
      Uuid.fromString(snapshot.userId),
      new Date(snapshot.createdAt),
      snapshot.state,
      snapshot.dispatchedAt ? new Date(snapshot.dispatchedAt) : undefined,
      snapshot.deliveredAt ? new Date(snapshot.deliveredAt) : undefined,
    );
  }

  dispatch(now: Date): void {
    if (this.state !== ShipmentState.PENDING) {
      throw new Error('Only pending shipments can be dispatched');
    }
    this.state = ShipmentState.DISPATCHED;
    this.dispatchedAt = now;
    this.recordEvent(new ShipmentDispatched(this.id.toString(), this.userId.toString()));
  }

  deliver(now: Date): void {
    if (this.state !== ShipmentState.DISPATCHED) {
      throw new Error('Only dispatched shipments can be delivered');
    }
    this.state = ShipmentState.DELIVERED;
    this.deliveredAt = now;
    this.recordEvent(new ShipmentDelivered(this.id.toString(), this.userId.toString()));
  }

  cancel(): void {
    if (this.state === ShipmentState.DELIVERED) {
      throw new Error('Delivered shipments cannot be cancelled');
    }
    if (this.state === ShipmentState.CANCELLED) {
      return;
    }
    this.state = ShipmentState.CANCELLED;
    this.recordEvent(new ShipmentCancelled(this.id.toString(), this.userId.toString()));
  }

  toSnapshot(): ShipmentSnapshot {
    return {
      id: this.id.toString(),
      orderId: this.orderId.toString(),
      userId: this.userId.toString(),
      createdAt: this.createdAt.toISOString(),
      state: this.state,
      dispatchedAt: this.dispatchedAt?.toISOString(),
      deliveredAt: this.deliveredAt?.toISOString(),
    };
  }
}

export interface ShipmentSnapshot {
  id: string;
  orderId: string;
  userId: string;
  createdAt: string;
  state: ShipmentState;
  dispatchedAt?: string;
  deliveredAt?: string;
}
