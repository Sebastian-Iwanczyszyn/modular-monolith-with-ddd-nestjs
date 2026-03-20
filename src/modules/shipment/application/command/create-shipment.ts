export class CreateShipment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly userId: string,
  ) {
  }
}
