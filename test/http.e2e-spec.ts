import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { DataSource } from 'typeorm';
import { Order, OrderSnapshot } from '../src/modules/order/domain/order';
import { OrderRepository } from '../src/modules/order/domain/order-repository';
import { OrderState } from '../src/modules/order/domain/value-object/order-state';
import { Payment, PaymentSnapshot } from '../src/modules/payment/domain/payment';
import { PaymentRepository } from '../src/modules/payment/domain/payment-repository';
import { PaymentState } from '../src/modules/payment/domain/value-object/payment-state';
import { Shipment, ShipmentSnapshot } from '../src/modules/shipment/domain/shipment';
import { ShipmentRepository } from '../src/modules/shipment/domain/shipment-repository';
import { ShipmentState } from '../src/modules/shipment/domain/value-object/shipment-state';
import { AppBuilder } from './app.builder';

describe('HTTP endpoints', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await AppBuilder.createHttpApp().build() as INestApplication<App>;
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "shipments", "payments", "orders" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/orders creates an order and GET /api/orders/:id returns it', async () => {
    const userId = Uuid.generate().toString();

    const createResponse = await request(app.getHttpServer())
      .post('/api/orders')
      .set('x-user-id', userId)
      .send({ amount: '25.00' })
      .expect(202);

    expect(createResponse.body).toEqual({
      id: expect.any(String),
    });

    const getResponse = await request(app.getHttpServer())
      .get(`/api/orders/${createResponse.body.id}`)
      .expect(200);

    expect(getResponse.body).toEqual({
      id: createResponse.body.id,
      product_id: expect.any(String),
      user_id: userId,
      amount: '25.00',
      state: 'WAITING_PAYMENT',
      created_at: expect.any(String),
    });
  });

  it('GET /api/payments/order/:orderId returns payment read model', async () => {
    const payment = await storePayment();

    const response = await request(app.getHttpServer())
      .get(`/api/payments/order/${payment.orderId}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      state: PaymentState.PENDING,
    }));
  });

  it('POST /api/payments/:id/complete marks payment as completed', async () => {
    const payment = await storePayment();
    await storeOrder({
      id: payment.orderId,
      userId: payment.userId,
    });

    await request(app.getHttpServer())
      .post(`/api/payments/${payment.id}/complete`)
      .expect(202);

    const storedPayment = await app.get(PaymentRepository).getById(payment.id);
    expect(storedPayment.toSnapshot().state).toBe(PaymentState.COMPLETED);
  });

  it('POST /api/payments/:id/fail marks payment as failed', async () => {
    const payment = await storePayment();

    await request(app.getHttpServer())
      .post(`/api/payments/${payment.id}/fail`)
      .expect(202);

    const storedPayment = await app.get(PaymentRepository).getById(payment.id);
    expect(storedPayment.toSnapshot().state).toBe(PaymentState.FAILED);
  });

  it('GET /api/shipments/:id returns shipment read model', async () => {
    const shipment = await storeShipment();

    const response = await request(app.getHttpServer())
      .get(`/api/shipments/${shipment.id}`)
      .expect(200);

    expect(response.body).toEqual({
      id: shipment.id,
      order_id: shipment.orderId,
      user_id: shipment.userId,
      state: ShipmentState.PENDING,
      created_at: shipment.createdAt,
      dispatched_at: null,
      delivered_at: null,
    });
  });

  it('GET /api/shipments/order/:orderId returns shipment read model', async () => {
    const shipment = await storeShipment();

    const response = await request(app.getHttpServer())
      .get(`/api/shipments/order/${shipment.orderId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: shipment.id,
      order_id: shipment.orderId,
      user_id: shipment.userId,
      state: ShipmentState.PENDING,
      created_at: shipment.createdAt,
      dispatched_at: null,
      delivered_at: null,
    });
  });

  it('POST /api/shipments/:id/dispatch marks shipment as dispatched', async () => {
    const shipment = await storeShipment();

    await request(app.getHttpServer())
      .post(`/api/shipments/${shipment.id}/dispatch`)
      .expect(202);

    const storedShipment = await app.get(ShipmentRepository).getById(shipment.id);
    const snapshot = storedShipment.toSnapshot();

    expect(snapshot.state).toBe(ShipmentState.DISPATCHED);
    expect(snapshot.dispatchedAt).toEqual(expect.any(String));
  });

  it('POST /api/shipments/:id/deliver marks shipment as delivered', async () => {
    const shipment = await storeShipment({
      state: ShipmentState.DISPATCHED,
      dispatchedAt: new Date().toISOString(),
    });

    await request(app.getHttpServer())
      .post(`/api/shipments/${shipment.id}/deliver`)
      .expect(202);

    const storedShipment = await app.get(ShipmentRepository).getById(shipment.id);
    const snapshot = storedShipment.toSnapshot();

    expect(snapshot.state).toBe(ShipmentState.DELIVERED);
    expect(snapshot.deliveredAt).toEqual(expect.any(String));
  });

  async function storePayment(overrides: Partial<PaymentSnapshot> = {}): Promise<PaymentSnapshot> {
    const payment: PaymentSnapshot = {
      id: Uuid.generate().toString(),
      externalId: Uuid.generate().toString(),
      amount: '25.00',
      createdAt: new Date().toISOString(),
      state: PaymentState.PENDING,
      orderId: Uuid.generate().toString(),
      userId: Uuid.generate().toString(),
      ...overrides,
    };

    await app.get(PaymentRepository).store(Payment.fromSnapshot(payment));
    return payment;
  }

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

    await app.get(OrderRepository).store(Order.fromSnapshot(order));
    return order;
  }

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

    await app.get(ShipmentRepository).store(Shipment.fromSnapshot(shipment));
    return shipment;
  }
});
