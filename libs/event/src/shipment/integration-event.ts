export class ShipmentCreatedIntegrationEvent {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly userId: string,
  ) {
  }
}
