import { Injectable } from '@nestjs/common';
import { ExternalPaymentVendor } from '../../domain/external-payment-vendor';
import { Uuid } from '@nestjstools/domain-driven-starter';
import { Amount } from '../../domain/value-object/amount';

@Injectable()
export class InMemoryExternalPaymentVendor implements ExternalPaymentVendor {
  createPayment(amount: Amount, id: Uuid): Promise<string> {
    return Promise.resolve(Uuid.generate().toString());
  }
}
