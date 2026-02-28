import { Module } from '@nestjs/common';
import { OrderModule } from './modules/order/order.module';
import { OrderController } from './ui/http/order.controller';
import { MessagingWrapperModule } from './common/messaging/messaging-wrapper.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentController } from './ui/http/payment.controller';

@Module({
  imports: [
    OrderModule,
    PaymentModule,
    MessagingWrapperModule,
  ],
  controllers: [
    OrderController,
    PaymentController,
  ],
})
export class AppModule {
}
