import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { Inject } from '@nestjs/common';
import { ShipmentRepository } from '../../../domain/shipment-repository';
import { DeliverShipment } from '../deliver-shipment';

@MessageHandler(CommandMapper.DeliverShipment)
export class DeliverShipmentHandler implements IMessageHandler<DeliverShipment> {
  constructor(
    @Inject(ShipmentRepository) private readonly shipmentRepository: ShipmentRepository,
  ) {
  }

  async handle(command: DeliverShipment): Promise<void> {
    const shipment = await this.shipmentRepository.getById(command.id);
    shipment.deliver(new Date());
    await this.shipmentRepository.store(shipment);
  }
}
