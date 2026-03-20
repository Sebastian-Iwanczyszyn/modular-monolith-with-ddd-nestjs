import { Injectable, Logger } from '@nestjs/common';
import { DomainEventBus } from '../../../../common/messaging/messaging.bus';
import { Shipment } from '../../domain/shipment';
import { ShipmentRepository } from '../../domain/shipment-repository';

@Injectable()
export class InMemoryShipmentRepository implements ShipmentRepository {
  private readonly logger = new Logger('InMemoryShipmentRepository');
  private readonly shipments = new Map<string, Shipment>();

  constructor(
    private readonly eventBus: DomainEventBus,
  ) {
  }

  async getById(id: string): Promise<Shipment> {
    const shipment = this.shipments.get(id);
    if (!shipment) {
      throw new Error(`Shipment with id ${id} not found`);
    }

    return shipment;
  }

  async getByOrderId(orderId: string): Promise<Shipment> {
    const shipment = [...this.shipments.values()].find(item => item.toSnapshot().orderId === orderId);
    if (!shipment) {
      throw new Error(`Shipment with orderId ${orderId} not found`);
    }

    return shipment;
  }

  async store(shipment: Shipment): Promise<void> {
    const snapshot = shipment.toSnapshot();
    this.shipments.set(snapshot.id, shipment);
    this.logger.log(`InMemoryShipmentRepository stored with id [${snapshot.id}]`);
    await this.eventBus.dispatch(shipment.popRecordedEvents());
  }
}
