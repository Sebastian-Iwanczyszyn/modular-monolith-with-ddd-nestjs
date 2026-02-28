export class Amount {
  private constructor(public readonly value: string) {
  }

  public static create(value: string): Amount {
    if (!value) {
      throw new Error('Amount value is required');
    }

    return new Amount(value);
  }

  toString(): string {
    return this.value;
  }
}
