import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '../../common/messaging/messaging.bus';
import { CreateOrder } from '../../modules/order/application/command/create-order';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { IsNotEmpty, IsString } from 'class-validator';

class CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  amount: string;
}

@Controller('/api/orders')
export class OrderController {
  constructor(private readonly commandBus: CommandBus) {
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createOrder(@Body() body: CreateOrderRequest): Promise<{ id: string }> {
    const id = Uuid.generate().toString();
    await this.commandBus.dispatch(new CreateOrder(
      id,
      body.productId,
      Uuid.generate().toString(),
      body.amount,
    ));

    return { id };
  }
}
