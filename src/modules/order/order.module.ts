import { Module } from '@nestjs/common';
import { OrderRepository } from './domain/order-repository';
import { OrderCommandHandlers } from './application/command/handler';
import { OrderEventHandlers } from './application/event/handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSchema } from './infrastructure/typeorm/order.schema';
import { TypeOrmOrderRepository } from './infrastructure/typeorm/typeorm.order-repository';
import { OrderQuery } from './application/query/order-query';
import { TypeormOrderQuery } from './infrastructure/typeorm/typeorm.order-query';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderSchema]),
  ],
  providers: [
    {
      provide: OrderRepository,
      useClass: TypeOrmOrderRepository,
    },
    {
      provide: OrderQuery,
      useClass: TypeormOrderQuery,
    },
    ...OrderCommandHandlers,
    ...OrderEventHandlers,
  ],
  exports: [OrderQuery],
})
export class OrderModule {
}
