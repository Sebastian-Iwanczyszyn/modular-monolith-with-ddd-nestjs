import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { AppBuilder } from '../../app.builder';
import { CommandBus } from '../../../src/common/messaging/messaging.bus';
import { CompletePayment } from '../../../src/modules/payment/application/command/complete-payment';
import { CreatePayment } from '../../../src/modules/payment/application/command/create-payment';
import { FailPayment } from '../../../src/modules/payment/application/command/fail-payment';
import { Payment, PaymentSnapshot } from '../../../src/modules/payment/domain/payment';
import { PaymentRepository } from '../../../src/modules/payment/domain/payment-repository';
import { PaymentState } from '../../../src/modules/payment/domain/value-object/payment-state';
import { PaymentModule } from '../../../src/modules/payment/payment.module';

describe('Payment command handlers e2e', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let commandBus: CommandBus;
  let paymentRepository: PaymentRepository;

  beforeAll(async () => {
    app = await AppBuilder.create({
      imports: [PaymentModule],
    }).build();
    dataSource = app.get(DataSource);
    commandBus = app.get(CommandBus);
    paymentRepository = app.get(PaymentRepository);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "payments" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('CreatePayment creates a pending payment', async () => {
    const command = new CreatePayment(
      Uuid.generate().toString(),
      Uuid.generate().toString(),
      Uuid.generate().toString(),
      '25.00',
    );

    await commandBus.dispatch(command);

    const payment = await paymentRepository.getById(command.id);
    expect(payment.toSnapshot()).toEqual(expect.objectContaining({
      id: command.id,
      orderId: command.orderId,
      userId: command.userId,
      amount: command.amount,
      state: PaymentState.PENDING,
      externalId: expect.any(String),
    }));
  });

  it('CompletePayment completes a pending payment', async () => {
    const payment = await storePayment();

    await commandBus.dispatch(new CompletePayment(payment.id));

    const storedPayment = await paymentRepository.getById(payment.id);
    expect(storedPayment.toSnapshot().state).toBe(PaymentState.COMPLETED);
  });

  it('CompletePayment throws for non-pending payment', async () => {
    const payment = await storePayment({ state: PaymentState.FAILED });

    await expectCommandError(
      commandBus.dispatch(new CompletePayment(payment.id)),
      'Only pending payments can be completed',
    );
  });

  it('FailPayment fails a pending payment', async () => {
    const payment = await storePayment();

    await commandBus.dispatch(new FailPayment(payment.id));

    const storedPayment = await paymentRepository.getById(payment.id);
    expect(storedPayment.toSnapshot().state).toBe(PaymentState.FAILED);
  });

  it('FailPayment throws for non-pending payment', async () => {
    const payment = await storePayment({ state: PaymentState.COMPLETED });

    await expectCommandError(
      commandBus.dispatch(new FailPayment(payment.id)),
      'Only pending payments can be failed',
    );
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

    await paymentRepository.store(Payment.fromSnapshot(payment));
    return payment;
  }

  async function expectCommandError(command: Promise<void>, message: string): Promise<void> {
    await expect(command).rejects.toMatchObject({
      errors: [expect.objectContaining({
        errorMessage: message,
      })],
    });
  }
});
