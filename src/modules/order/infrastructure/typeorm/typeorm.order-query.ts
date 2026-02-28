import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Snapshot } from '../../domain/order';
import { OrderSchema } from './order.schema';
import { OrderQuery, OrderReadModel } from '../../application/query/order-query';

@Injectable()
export class TypeormOrderQuery implements OrderQuery {
  constructor(
    @InjectRepository(OrderSchema) private readonly repository: Repository<Snapshot>,
  ) {
  }

  async getById(id: string): Promise<OrderReadModel> {
    const order = await this.repository.findOne({ where: { id } });
    if (!order) {
      throw new Error(`Order with id [${id}] not found`);
    }

    return {
      id: order.id,
      product_id: order.productId,
      user_id: order.userId,
      amount: order.amount,
      state: order.state,
      created_at: order.createdAt,
    };
  }
}
