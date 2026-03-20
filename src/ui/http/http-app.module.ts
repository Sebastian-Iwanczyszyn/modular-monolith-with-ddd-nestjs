import { Module } from '@nestjs/common';
import { OrderModule } from '../../modules/order/order.module';
import { PaymentModule } from '../../modules/payment/payment.module';
import { ShipmentModule } from '../../modules/shipment/shipment.module';
import { NotificationModule } from '../../modules/notification/notification.module';
import { OrderController } from './order.controller';
import { PaymentController } from './payment.controller';
import { ShipmentController } from './shipment.controller';


@Module({
  imports: [
    OrderModule,
    PaymentModule,
    ShipmentModule,
    NotificationModule,
  ],
  controllers: [
    OrderController,
    PaymentController,
    ShipmentController,
  ],
})
export class HttpAppModule {
}
