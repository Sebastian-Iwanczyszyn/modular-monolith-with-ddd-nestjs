import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { CommandBus } from '../../common/messaging/messaging.bus';
import { CompletePayment } from '../../modules/payment/application/command/complete-payment';
import { FailPayment } from '../../modules/payment/application/command/fail-payment';
import { PaymentQuery, PaymentReadModel } from '../../modules/payment/application/query/payment-query';

@Controller('/api/payments')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus, @Inject(PaymentQuery) private readonly paymentQuery: PaymentQuery) {
  }

  @Get('/order/:orderId')
  @HttpCode(HttpStatus.OK)
  async getByOrderId(@Param('orderId') orderId: string): Promise<PaymentReadModel> {
    return this.paymentQuery.getByOrderId(orderId);
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
