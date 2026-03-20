export class EmailSentIntegrationEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly recipient: string,
    public readonly template: string,
  ) {
  }
}
