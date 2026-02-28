export class PaymentFailed {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class PaymentCompleted {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}

export class PaymentCreated {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {
  }
}
