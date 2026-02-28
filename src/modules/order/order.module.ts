import { Module } from '@nestjs/common';
import { OrderRepository } from './domain/order-repository';
import { InMemoryOrderRepository } from './infrastructure/typeorm/in-memory.order-repository';
import { OrderCommandHandlers } from './application/command/handler';
import { OrderEventHandlers } from './application/event/handler';

@Module({
  imports: [],
  providers: [
    {
      provide: OrderRepository,
      useClass: InMemoryOrderRepository,
    },
    ...OrderCommandHandlers,
    ...OrderEventHandlers,
  ],
})
export class OrderModule {
}
