import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CommandBus } from '../../common/messaging/messaging.bus';
import { CreateOrder } from '../../modules/order/application/command/create-order';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { IsNotEmpty, IsString } from 'class-validator';
import { CompletePayment } from '../../modules/payment/application/command/complete-payment';
import { FailPayment } from '../../modules/payment/application/command/fail-payment';

@Controller('/api/payments')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.ACCEPTED)
  async completePayment(@Param('id') id: string): Promise<void> {
    return this.commandBus.dispatch(new CompletePayment(
      id,
    ));
  }

  @Post(':id/fail')
  @HttpCode(HttpStatus.ACCEPTED)
  async failPayment(@Param('id') id: string): Promise<void> {
    return this.commandBus.dispatch(new FailPayment(
      id,
    ));
  }
}
