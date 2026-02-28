export class PaymentFailed {
  constructor(
    public readonly id: string,
  ) {
  }
}

export class PaymentCompleted {
  constructor(
    public readonly id: string,
  ) {
  }
}

export class PaymentCreated {
  constructor(
    public readonly id: string,
  ) {
  }
}
