import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { Inject } from '@nestjs/common';
import { ShipmentRepository } from '../../../domain/shipment-repository';
import { CancelShipment } from '../cancel-shipment';

@MessageHandler(CommandMapper.CancelShipment)
export class CancelShipmentHandler implements IMessageHandler<CancelShipment> {
  constructor(
    @Inject(ShipmentRepository) private readonly shipmentRepository: ShipmentRepository,
  ) {
  }

  async handle(command: CancelShipment): Promise<void> {
    const shipment = await this.shipmentRepository.getById(command.id);
    shipment.cancel();
    await this.shipmentRepository.store(shipment);
  }
}
