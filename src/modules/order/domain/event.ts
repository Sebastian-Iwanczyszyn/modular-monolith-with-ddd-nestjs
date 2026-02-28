export class OrderCreated {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class OrderPaid {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class OrderCompleted {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class OrderCancelled {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}
