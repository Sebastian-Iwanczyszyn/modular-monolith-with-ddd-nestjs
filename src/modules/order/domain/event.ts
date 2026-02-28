export class OrderCreated {
  constructor(
    public readonly id: string,
  ) {
  }
}

export class OrderPaid {
  constructor(
    public readonly id: string,
  ) {
  }
}

export class OrderCompleted {
  constructor(
    public readonly id: string,
  ) {
  }
}

export class OrderCancelled {
  constructor(
    public readonly id: string,
  ) {
  }
}
