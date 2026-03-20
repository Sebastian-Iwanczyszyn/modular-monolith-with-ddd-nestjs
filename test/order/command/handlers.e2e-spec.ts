import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { AppBuilder } from '../../app.builder';
import { CommandBus } from '../../../src/common/messaging/messaging.bus';
import { CancelOrder } from '../../../src/modules/order/application/command/cancel-order';
import { CompleteOrder } from '../../../src/modules/order/application/command/complete-order';
import { CreateOrder } from '../../../src/modules/order/application/command/create-order';
import { MarkOrderInProgress } from '../../../src/modules/order/application/command/mark-order-in-progress';
import { MarkOrderPaid } from '../../../src/modules/order/application/command/mark-order-paid';
import { Order, OrderSnapshot } from '../../../src/modules/order/domain/order';
import { OrderRepository } from '../../../src/modules/order/domain/order-repository';
import { OrderState } from '../../../src/modules/order/domain/value-object/order-state';
import { OrderModule } from '../../../src/modules/order/order.module';

describe('Order command handlers e2e', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let commandBus: CommandBus;
  let orderRepository: OrderRepository;

  beforeAll(async () => {
    app = await AppBuilder.create({
      imports: [OrderModule],
    }).build();
    dataSource = app.get(DataSource);
    commandBus = app.get(CommandBus);
    orderRepository = app.get(OrderRepository);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "orders" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('CreateOrder creates a waiting payment order', async () => {
    const command = new CreateOrder(
      Uuid.generate().toString(),
      Uuid.generate().toString(),
      Uuid.generate().toString(),
      '25.00',
    );

    await commandBus.dispatch(command);

    const order = await orderRepository.getById(command.id);
    expect(order.toSnapshot()).toEqual(expect.objectContaining({
      id: command.id,
      productId: command.productId,
      userId: command.userId,
      amount: command.amount,
      state: OrderState.WAITING_PAYMENT,
    }));
  });

  it('MarkOrderPaid moves order to in progress through domain event flow', async () => {
    const order = await storeOrder();

    await commandBus.dispatch(new MarkOrderPaid(order.id));

    const storedOrder = await orderRepository.getById(order.id);
    expect(storedOrder.toSnapshot().state).toBe(OrderState.IN_PROGRESS);
  });

  it('MarkOrderInProgress moves waiting payment order to in progress', async () => {
    const order = await storeOrder();

    await commandBus.dispatch(new MarkOrderInProgress(order.id));

    const storedOrder = await orderRepository.getById(order.id);
    expect(storedOrder.toSnapshot().state).toBe(OrderState.IN_PROGRESS);
  });

  it('MarkOrderInProgress throws for non-waiting-payment order', async () => {
    const order = await storeOrder({ state: OrderState.IN_PROGRESS });

    await expectCommandError(
      commandBus.dispatch(new MarkOrderInProgress(order.id)),
      'Only waiting payment orders can be marked as ready to ship',
    );
  });

  it('CompleteOrder completes an in-progress order', async () => {
    const order = await storeOrder({ state: OrderState.IN_PROGRESS });

    await commandBus.dispatch(new CompleteOrder(order.id));

    const storedOrder = await orderRepository.getById(order.id);
    expect(storedOrder.toSnapshot().state).toBe(OrderState.COMPLETED);
  });

  it('CompleteOrder throws when order is not in progress', async () => {
    const order = await storeOrder();

    await expectCommandError(
      commandBus.dispatch(new CompleteOrder(order.id)),
      'Only in-progress orders can be completed',
    );
  });

  it('CancelOrder cancels a non-completed order', async () => {
    const order = await storeOrder({ state: OrderState.IN_PROGRESS });

    await commandBus.dispatch(new CancelOrder(order.id));

    const storedOrder = await orderRepository.getById(order.id);
    expect(storedOrder.toSnapshot().state).toBe(OrderState.CANCELLED);
  });

  it('CancelOrder throws for completed order', async () => {
    const order = await storeOrder({ state: OrderState.COMPLETED });

    await expectCommandError(
      commandBus.dispatch(new CancelOrder(order.id)),
      'Completed orders cannot be cancelled',
    );
  });

  async function storeOrder(overrides: Partial<OrderSnapshot> = {}): Promise<OrderSnapshot> {
    const order: OrderSnapshot = {
      id: Uuid.generate().toString(),
      productId: Uuid.generate().toString(),
      amount: '25.00',
      createdAt: new Date().toISOString(),
      state: OrderState.WAITING_PAYMENT,
      userId: Uuid.generate().toString(),
      ...overrides,
    };

    await orderRepository.store(Order.fromSnapshot(order));
    return order;
  }

  async function expectCommandError(command: Promise<void>, message: string): Promise<void> {
    await expect(command).rejects.toMatchObject({
      errors: [expect.objectContaining({
        errorMessage: message,
      })],
    });
  }
});
