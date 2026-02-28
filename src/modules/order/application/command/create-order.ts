export class CreateOrder {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly userId: string,
    public readonly amount: string,
  ) {
  }
}
