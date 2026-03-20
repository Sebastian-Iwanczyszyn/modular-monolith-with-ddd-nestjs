import { Injectable, Logger } from '@nestjs/common';
import { EmailSender, SendEmailInput } from '../port/email-sender.port';

@Injectable()
export class InMemoryEmailSender implements EmailSender {
  private readonly logger = new Logger('InMemoryEmailSender');

  async send(input: SendEmailInput): Promise<void> {
    this.logger.log(
      `Fake email sent to [${input.recipient}] for user [${input.userId}] with subject [${input.subject}]`,
    );
  }
}
