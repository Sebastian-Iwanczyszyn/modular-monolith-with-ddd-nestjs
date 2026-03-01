export class Amount {
  private constructor(public readonly value: string) {
  }

  public static create(value: string): Amount {
    const raw = value?.trim();

    if (!raw) {
      throw new Error('Amount value is required');
    }

    if (!/^\d+\.\d+$/.test(raw)) {
      throw new Error('Amount must be in float format (e.g. 1.00)');
    }

    const numericValue = Number(raw);
    if (!Number.isFinite(numericValue)) {
      throw new Error('Amount must be a valid number');
    }

    if (numericValue < 1) {
      throw new Error('Amount must be greater than or equal to 1');
    }

    return new Amount(raw);
  }

  toString(): string {
    return this.value;
  }
}
