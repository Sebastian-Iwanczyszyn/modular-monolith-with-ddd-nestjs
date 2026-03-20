import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { CommandBus } from '../../common/messaging/messaging.bus';
import { ShipmentQuery, ShipmentReadModel } from '../../modules/shipment/application/query/shipment-query';
import { DispatchShipment } from '../../modules/shipment/application/command/dispatch-shipment';
import { DeliverShipment } from '../../modules/shipment/application/command/deliver-shipment';

@Controller('/api/shipments')
export class ShipmentController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(ShipmentQuery) private readonly shipmentQuery: ShipmentQuery,
  ) {
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<ShipmentReadModel> {
    return this.shipmentQuery.getById(id);
  }

  @Get('/order/:orderId')
  @HttpCode(HttpStatus.OK)
  async getByOrderId(@Param('orderId') orderId: string): Promise<ShipmentReadModel> {
    return this.shipmentQuery.getByOrderId(orderId);
  }

  @Post(':id/dispatch')
  @HttpCode(HttpStatus.ACCEPTED)
  async dispatch(@Param('id') id: string): Promise<void> {
    return this.commandBus.dispatch(new DispatchShipment(id));
  }

  @Post(':id/deliver')
  @HttpCode(HttpStatus.ACCEPTED)
  async deliver(@Param('id') id: string): Promise<void> {
    return this.commandBus.dispatch(new DeliverShipment(id));
  }
}
