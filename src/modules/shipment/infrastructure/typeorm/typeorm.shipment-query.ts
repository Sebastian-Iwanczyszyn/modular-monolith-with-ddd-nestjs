import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentReadModel, ShipmentQuery } from '../../application/query/shipment-query';
import { ShipmentRecord, ShipmentSchema } from './shipment.schema';

@Injectable()
export class TypeormShipmentQuery implements ShipmentQuery {
  constructor(
    @InjectRepository(ShipmentSchema) private readonly repository: Repository<ShipmentRecord>,
  ) {
  }

  async getById(id: string): Promise<ShipmentReadModel> {
    const shipment = await this.repository.findOne({ where: { id } });
    if (!shipment) {
      throw new Error(`Shipment with id [${id}] not found`);
    }

    return this.toReadModel(shipment);
  }

  async getByOrderId(orderId: string): Promise<ShipmentReadModel> {
    const shipment = await this.repository.findOne({ where: { orderId } });
    if (!shipment) {
      throw new Error(`Shipment with orderId [${orderId}] not found`);
    }

    return this.toReadModel(shipment);
  }

  private toReadModel(shipment: ShipmentRecord): ShipmentReadModel {
    return {
      id: shipment.id,
      order_id: shipment.orderId,
      user_id: shipment.userId,
      state: shipment.state,
      created_at: shipment.createdAt as unknown as string,
      dispatched_at: shipment.dispatchedAt as unknown as string,
      delivered_at: shipment.deliveredAt as unknown as string,
    };
  }
}
