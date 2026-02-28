export class PaymentCompletedIntegrationEvent {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly userId: string,
  ) {
  }
}
