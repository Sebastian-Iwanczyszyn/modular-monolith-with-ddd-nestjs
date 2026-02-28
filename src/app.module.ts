import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './modules/order/order.module';
import { OrderController } from './ui/http/order.controller';
import { MessagingWrapperModule } from './common/messaging/messaging-wrapper.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentController } from './ui/http/payment.controller';
import { Environemnt } from './environemnt';
import { AppGateway } from './ui/ws/app.gateway';

@Module({
  imports: [
    OrderModule,
    PaymentModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environemnt.DB_HOST,
      port: Environemnt.DB_PORT,
      username: Environemnt.DB_USERNAME,
      password: Environemnt.DB_PASSWORD,
      database: Environemnt.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MessagingWrapperModule,
  ],
  controllers: [
    OrderController,
    PaymentController,
  ],
  providers: [
    AppGateway,
  ],
})
export class AppModule {
}
