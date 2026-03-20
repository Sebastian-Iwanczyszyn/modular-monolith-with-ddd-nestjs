import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { EventMapper } from '../../../../../message-mapper';
import { OrderCancelled } from '../../../../order/domain/event';
import { CommandBus } from '../../../../../common/messaging/messaging.bus';
import { CancelShipment } from '../../command/cancel-shipment';
import { Inject } from '@nestjs/common';
import { ShipmentQuery } from '../../query/shipment-query';

@MessageHandler(EventMapper.OrderCancelled)
export class CancelShipmentOnOrderCancelledHandler implements IMessageHandler<OrderCancelled> {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(ShipmentQuery) private readonly shipmentQuery: ShipmentQuery,
  ) {
  }

  async handle(event: OrderCancelled): Promise<void> {
    const shipment = await this.shipmentQuery.getByOrderId(event.id).catch(() => null);
    if (!shipment) {
      return;
    }

    await this.commandBus.dispatch(new CancelShipment(
      shipment.id,
    ));
  }
}
