import { Module } from '@nestjs/common';
import { PaymentRepository } from './domain/payment-repository';
import { InMemoryPaymentRepository } from './infrastructure/typeorm/in-memory.payment-repository';
import { CommandHandlers } from './application/command/handler';
import { EventHandlers } from './application/event/handler';
import { ExternalPaymentVendor } from './domain/external-payment-vendor';
import { InMemoryExternalPaymentVendor } from './infrastructure/payment-vendor/in-memory.external-payment-vendor';

@Module({
  imports: [],
  providers: [
    {
      provide: PaymentRepository,
      useClass: InMemoryPaymentRepository,
    },
    {
      provide: ExternalPaymentVendor,
      useClass: InMemoryExternalPaymentVendor,
    },
    ...EventHandlers,
    ...CommandHandlers,
  ],
})
export class PaymentModule {
}
