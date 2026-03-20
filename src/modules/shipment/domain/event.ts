export class ShipmentCreated {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class ShipmentDispatched {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class ShipmentDelivered {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class ShipmentCancelled {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}
