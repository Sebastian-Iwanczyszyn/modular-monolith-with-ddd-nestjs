import { AggregateRoot, Uuid } from '@nestjstools/domain-driven-starter';
import { Amount } from './value-object/amount';
import { OrderState } from './value-object/order-state';
import {
  OrderCancelled,
  OrderCompleted,
  OrderCreated,
  OrderPaid,
} from './event';

export class Order extends AggregateRoot {
  private constructor(
    id: Uuid,
    private productId: Uuid,
    private amount: Amount,
    private createdAt: Date,
    private state: OrderState,
    private userId: Uuid,
  ) {
    super(id);
  }

  public static create(
    id: Uuid,
    productId: Uuid,
    amount: Amount,
    userId: Uuid,
    now: Date,
  ): Order {
    const order = new Order(
      id,
      productId,
      amount,
      now,
      OrderState.WAITING_PAYMENT,
      userId,
    );
    order.recordEvent(new OrderCreated(id.toString()));

    return order;
  }

  public static fromSnapshot(snapshot: Snapshot): Order {
    return new Order(
      Uuid.fromString(snapshot.id),
      Uuid.fromString(snapshot.productId),
      Amount.create(snapshot.amount),
      new Date(snapshot.createdAt),
      snapshot.state,
      Uuid.fromString(snapshot.userId),
    );
  }

  public markPaid(): void {
    if (this.state !== OrderState.WAITING_PAYMENT) {
      throw new Error('Only waiting payment orders can be marked as paid');
    }
    this.recordEvent(new OrderPaid(this.id.toString()));
  }

  public markInProgress(): void {
    if (this.state !== OrderState.WAITING_PAYMENT) {
      throw new Error('Only waiting payment orders can be marked as ready to ship');
    }
    this.state = OrderState.IN_PROGRESS;
  }

  public complete(): void {
    if (this.state !== OrderState.IN_PROGRESS) {
      throw new Error('Only in-progress orders can be completed');
    }
    this.state = OrderState.COMPLETED;
    this.recordEvent(new OrderCompleted(this.id.toString()));
  }

  public cancel(): void {
    if (this.state === OrderState.COMPLETED) {
      throw new Error('Completed orders cannot be cancelled');
    }
    if (this.state === OrderState.CANCELLED) {
      return;
    }
    this.state = OrderState.CANCELLED;
    this.recordEvent(new OrderCancelled(this.id.toString()));
  }

  toSnapshot(): Snapshot {
    return {
      id: this.id.toString(),
      productId: this.productId.toString(),
      amount: this.amount.toString(),
      createdAt: this.createdAt.toISOString(),
      state: this.state,
      userId: this.userId.toString(),
    };
  }
}

export interface Snapshot {
  id: string;
  productId: string;
  amount: string;
  createdAt: string;
  state: OrderState;
  userId: string;
}
