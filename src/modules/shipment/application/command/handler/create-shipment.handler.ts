import { IMessageHandler, MessageHandler } from '@nestjstools/messaging';
import { CommandMapper } from '../../../../../message-mapper';
import { Inject } from '@nestjs/common';
import { ShipmentRepository } from '../../../domain/shipment-repository';
import { CreateShipment } from '../create-shipment';
import { Shipment } from '../../../domain/shipment';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { IntegrationEventBus } from '../../../../../common/messaging/messaging.bus';
import { ShipmentCreatedIntegrationEvent } from '@lib/event';

@MessageHandler(CommandMapper.CreateShipment)
export class CreateShipmentHandler implements IMessageHandler<CreateShipment> {
  constructor(
    @Inject(ShipmentRepository) private readonly shipmentRepository: ShipmentRepository,
    private readonly integrationEventBus: IntegrationEventBus,
  ) {
  }

  async handle(command: CreateShipment): Promise<void> {
    try {
      await this.shipmentRepository.getByOrderId(command.orderId);
      return;
    } catch {
      const shipment = Shipment.create(
        Uuid.fromString(command.id),
        Uuid.fromString(command.orderId),
        Uuid.fromString(command.userId),
        new Date(),
      );
      await this.shipmentRepository.store(shipment);
      const snapshot = shipment.toSnapshot();
      await this.integrationEventBus.dispatch(new ShipmentCreatedIntegrationEvent(
        snapshot.id,
        snapshot.orderId,
        snapshot.userId,
      ));
    }
  }
}
