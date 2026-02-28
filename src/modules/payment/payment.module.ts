import { Module } from '@nestjs/common';
import { PaymentRepository } from './domain/payment-repository';
import { CommandHandlers } from './application/command/handler';
import { EventHandlers } from './application/event/handler';
import { ExternalPaymentVendor } from './domain/external-payment-vendor';
import { InMemoryExternalPaymentVendor } from './infrastructure/payment-vendor/in-memory.external-payment-vendor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSchema } from './infrastructure/typeorm/payment.schema';
import { TypeOrmPaymentRepository } from './infrastructure/typeorm/typeorm.payment-repository';
import { PaymentQuery } from './application/query/payment-query';
import { TypeormPaymentQuery } from './infrastructure/typeorm/typeorm.payment-query';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentSchema]),
  ],
  providers: [
    {
      provide: PaymentRepository,
      useClass: TypeOrmPaymentRepository,
    },
    {
      provide: ExternalPaymentVendor,
      useClass: InMemoryExternalPaymentVendor,
    },
    {
      provide: PaymentQuery,
      useClass: TypeormPaymentQuery,
    },
    ...EventHandlers,
    ...CommandHandlers,
  ],
  exports: [PaymentQuery]
})
export class PaymentModule {
}
