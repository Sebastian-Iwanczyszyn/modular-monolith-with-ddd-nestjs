import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { AppBuilder } from '../../app.builder';
import { CommandBus } from '../../../src/common/messaging/messaging.bus';
import { CancelShipment } from '../../../src/modules/shipment/application/command/cancel-shipment';
import { CreateShipment } from '../../../src/modules/shipment/application/command/create-shipment';
import { DeliverShipment } from '../../../src/modules/shipment/application/command/deliver-shipment';
import { DispatchShipment } from '../../../src/modules/shipment/application/command/dispatch-shipment';
import { Shipment, ShipmentSnapshot } from '../../../src/modules/shipment/domain/shipment';
import { ShipmentRepository } from '../../../src/modules/shipment/domain/shipment-repository';
import { ShipmentState } from '../../../src/modules/shipment/domain/value-object/shipment-state';
import { ShipmentModule } from '../../../src/modules/shipment/shipment.module';

describe('Shipment command handlers e2e', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let commandBus: CommandBus;
  let shipmentRepository: ShipmentRepository;

  beforeAll(async () => {
    app = await AppBuilder.create({
      imports: [ShipmentModule],
    }).build();
    dataSource = app.get(DataSource);
    commandBus = app.get(CommandBus);
    shipmentRepository = app.get(ShipmentRepository);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "shipments" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('CreateShipment creates a pending shipment', async () => {
    const command = new CreateShipment(
      Uuid.generate().toString(),
      Uuid.generate().toString(),
      Uuid.generate().toString(),
    );

    await commandBus.dispatch(command);

    const shipment = await shipmentRepository.getById(command.id);
    expect(shipment.toSnapshot()).toEqual(expect.objectContaining({
      id: command.id,
      orderId: command.orderId,
      userId: command.userId,
      state: ShipmentState.PENDING,
    }));
  });

  it('CreateShipment is idempotent by order id', async () => {
    const existingShipment = await storeShipment();

    await commandBus.dispatch(new CreateShipment(
      Uuid.generate().toString(),
      existingShipment.orderId,
      existingShipment.userId,
    ));

    const storedShipment = await shipmentRepository.getByOrderId(existingShipment.orderId);
    expect(storedShipment.toSnapshot().id).toBe(existingShipment.id);
  });

  it('DispatchShipment dispatches a pending shipment', async () => {
    const shipment = await storeShipment();

    await commandBus.dispatch(new DispatchShipment(shipment.id));

    const storedShipment = await shipmentRepository.getById(shipment.id);
    const snapshot = storedShipment.toSnapshot();

    expect(snapshot.state).toBe(ShipmentState.DISPATCHED);
    expect(snapshot.dispatchedAt).toEqual(expect.any(String));
  });

  it('DispatchShipment throws for non-pending shipment', async () => {
    const shipment = await storeShipment({ state: ShipmentState.CANCELLED });

    await expectCommandError(
      commandBus.dispatch(new DispatchShipment(shipment.id)),
      'Only pending shipments can be dispatched',
    );
  });

  it('DeliverShipment delivers a dispatched shipment', async () => {
    const shipment = await storeShipment({
      state: ShipmentState.DISPATCHED,
      dispatchedAt: new Date().toISOString(),
    });

    await commandBus.dispatch(new DeliverShipment(shipment.id));

    const storedShipment = await shipmentRepository.getById(shipment.id);
    const snapshot = storedShipment.toSnapshot();

    expect(snapshot.state).toBe(ShipmentState.DELIVERED);
    expect(snapshot.deliveredAt).toEqual(expect.any(String));
  });

  it('DeliverShipment throws for non-dispatched shipment', async () => {
    const shipment = await storeShipment();

    await expectCommandError(
      commandBus.dispatch(new DeliverShipment(shipment.id)),
      'Only dispatched shipments can be delivered',
    );
  });

  it('CancelShipment cancels a shipment', async () => {
    const shipment = await storeShipment();

    await commandBus.dispatch(new CancelShipment(shipment.id));

    const storedShipment = await shipmentRepository.getById(shipment.id);
    expect(storedShipment.toSnapshot().state).toBe(ShipmentState.CANCELLED);
  });

  it('CancelShipment throws for delivered shipment', async () => {
    const shipment = await storeShipment({
      state: ShipmentState.DELIVERED,
      dispatchedAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
    });

    await expectCommandError(
      commandBus.dispatch(new CancelShipment(shipment.id)),
      'Delivered shipments cannot be cancelled',
    );
  });

  async function storeShipment(overrides: Partial<ShipmentSnapshot> = {}): Promise<ShipmentSnapshot> {
    const shipment: ShipmentSnapshot = {
      id: Uuid.generate().toString(),
      orderId: Uuid.generate().toString(),
      userId: Uuid.generate().toString(),
      createdAt: new Date().toISOString(),
      state: ShipmentState.PENDING,
      dispatchedAt: undefined,
      deliveredAt: undefined,
      ...overrides,
    };

    await shipmentRepository.store(Shipment.fromSnapshot(shipment));
    return shipment;
  }

  async function expectCommandError(command: Promise<void>, message: string): Promise<void> {
    await expect(command).rejects.toMatchObject({
      errors: [expect.objectContaining({
        errorMessage: message,
      })],
    });
  }
});
