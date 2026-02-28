import { Uuid } from '@nestjstools/domain-driven-starter';
import { Amount } from './value-object/amount';

export interface ExternalPaymentVendor {
  createPayment(amount: Amount, id: Uuid): Promise<string>;
}

export const ExternalPaymentVendor = Symbol('ExternalPaymentVendor');
