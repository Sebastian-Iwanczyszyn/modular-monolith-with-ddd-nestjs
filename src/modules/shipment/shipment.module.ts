import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentCommandHandlers } from './application/command/handler';
import { ShipmentEventHandlers } from './application/event/handler';
import { ShipmentQuery } from './application/query/shipment-query';
import { ShipmentRepository } from './domain/shipment-repository';
import { ShipmentSchema } from './infrastructure/typeorm/shipment.schema';
import { TypeormShipmentQuery } from './infrastructure/typeorm/typeorm.shipment-query';
import { TypeOrmShipmentRepository } from './infrastructure/typeorm/typeorm.shipment-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentSchema]),
  ],
  providers: [
    {
      provide: ShipmentRepository,
      useClass: TypeOrmShipmentRepository,
    },
    {
      provide: ShipmentQuery,
      useClass: TypeormShipmentQuery,
    },
    ...ShipmentCommandHandlers,
    ...ShipmentEventHandlers,
  ],
  exports: [ShipmentQuery],
})
export class ShipmentModule {
}
