import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Inject } from '@nestjs/common';
import { CommandBus } from '../../common/messaging/messaging.bus';
import { CreateOrder } from '../../modules/order/application/command/create-order';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { CreateOrderRequest } from './request/order.request';
import { OrderQuery, OrderReadModel } from '../../modules/order/application/query/order-query';

@Controller('/api/orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(OrderQuery) private readonly orderQuery: OrderQuery,
  ) {
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<OrderReadModel> {
    return this.orderQuery.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createOrder(@Body() body: CreateOrderRequest, @Headers('x-user-id') userId: string): Promise<{ id: string }> {
    const id = Uuid.generate().toString();
    await this.commandBus.dispatch(new CreateOrder(
      id,
      Uuid.generate().toString(),
      userId,
      body.amount,
    ));

    return { id };
  }
}
