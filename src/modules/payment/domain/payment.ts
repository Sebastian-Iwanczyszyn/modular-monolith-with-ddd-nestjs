import { AggregateRoot, Uuid } from '@nestjstools/domain-driven-starter';
import { Amount } from './value-object/amount';
import { PaymentState } from './value-object/payment-state';
import { PaymentCompleted, PaymentCreated, PaymentFailed } from './event';
import { ExternalPaymentVendor } from './external-payment-vendor';

export class Payment extends AggregateRoot {
  private constructor(
    id: Uuid,
    private externalId: string,
    private amount: Amount,
    private createdAt: Date,
    private state: PaymentState,
    private orderId: Uuid,
    private userId: Uuid,
  ) {
    super(id);
  }

  static async create(
    id: Uuid,
    amount: Amount,
    orderId: Uuid,
    userId: Uuid,
    now: Date,
    vendorPayment: ExternalPaymentVendor,
  ): Promise<Payment> {
    const payment = new Payment(
      id,
      await vendorPayment.createPayment(amount, id),
      amount,
      now,
      PaymentState.PENDING,
      orderId,
      userId,
    );
    payment.recordEvent(new PaymentCreated(id.toString()));
    return payment;
  }

  public static fromSnapshot(snapshot: Snapshot): Payment {
    return new Payment(
      Uuid.fromString(snapshot.id),
      snapshot.externalId,
      Amount.create(snapshot.amount),
      new Date(snapshot.createdAt),
      snapshot.state,
      Uuid.fromString(snapshot.orderId),
      Uuid.fromString(snapshot.userId),
    );
  }

  complete(): void {
    if (this.state !== PaymentState.PENDING) {
      throw new Error('Only pending payments can be completed');
    }
    this.state = PaymentState.COMPLETED;
    this.recordEvent(new PaymentCompleted(this.id.toString()));
  }

  fail(): void {
    if (this.state !== PaymentState.PENDING) {
      throw new Error('Only pending payments can be failed');
    }
    this.state = PaymentState.FAILED;
    this.recordEvent(new PaymentFailed(this.id.toString()));
  }

  toSnapshot(): Snapshot {
    return {
      id: this.id.toString(),
      externalId: this.externalId,
      amount: this.amount.toString(),
      createdAt: this.createdAt.toISOString(),
      state: this.state,
      orderId: this.orderId.toString(),
      userId: this.userId.toString(),
    };
  }
}

export interface Snapshot {
  id: string;
  externalId: string;
  amount: string;
  createdAt: string;
  state: PaymentState;
  orderId: string;
  userId: string;
}
