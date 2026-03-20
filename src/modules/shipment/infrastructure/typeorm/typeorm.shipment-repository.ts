import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainEventBus } from '../../../../common/messaging/messaging.bus';
import { Shipment } from '../../domain/shipment';
import { ShipmentRepository } from '../../domain/shipment-repository';
import { ShipmentRecord, ShipmentSchema } from './shipment.schema';

@Injectable()
export class TypeOrmShipmentRepository implements ShipmentRepository {
  constructor(
    @InjectRepository(ShipmentSchema) private readonly repository: Repository<ShipmentRecord>,
    private readonly eventBus: DomainEventBus,
  ) {
  }

  async getById(id: string): Promise<Shipment> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Shipment with id ${id} not found`);
    }

    return Shipment.fromSnapshot(entity);
  }

  async getByOrderId(orderId: string): Promise<Shipment> {
    const entity = await this.repository.findOne({ where: { orderId } });
    if (!entity) {
      throw new Error(`Shipment with orderId ${orderId} not found`);
    }

    return Shipment.fromSnapshot(entity);
  }

  async store(shipment: Shipment): Promise<void> {
    await this.repository.save(shipment.toSnapshot());
    await this.eventBus.dispatch(shipment.popRecordedEvents());
  }
}
