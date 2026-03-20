import { Module } from '@nestjs/common';
import { InMemoryEmailSender } from './adapter/in-memory.email-sender';
import { NotificationHandlers } from './handler';
import { EmailSender } from './port/email-sender.port';

@Module({
  providers: [
    {
      provide: EmailSender,
      useClass: InMemoryEmailSender,
    },
    ...NotificationHandlers,
  ],
})
export class NotificationModule {
}
