export interface EmailSender {
  send(input: SendEmailInput): Promise<void>;
}

export interface SendEmailInput {
  userId: string;
  recipient: string;
  subject: string;
  body: string;
}

export const EmailSender = Symbol('EmailSender');
