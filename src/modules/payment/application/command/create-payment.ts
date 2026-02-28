export class CreatePayment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly userId: string,
    public readonly amount: string,
  ) {
  }
}
