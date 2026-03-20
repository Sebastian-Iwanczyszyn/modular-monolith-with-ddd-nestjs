import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { Inject } from '@nestjs/common';
import { ShipmentRepository } from '../../../domain/shipment-repository';
import { DispatchShipment } from '../dispatch-shipment';

@MessageHandler(CommandMapper.DispatchShipment)
export class DispatchShipmentHandler implements IMessageHandler<DispatchShipment> {
  constructor(
    @Inject(ShipmentRepository) private readonly shipmentRepository: ShipmentRepository,
  ) {
  }

  async handle(command: DispatchShipment): Promise<void> {
    const shipment = await this.shipmentRepository.getById(command.id);
    shipment.dispatch(new Date());
    await this.shipmentRepository.store(shipment);
  }
}
