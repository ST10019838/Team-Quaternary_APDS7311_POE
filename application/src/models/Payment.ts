import { Schema } from 'mongoose';
import { z } from 'zod';

export default interface Payment {
  // _id: Schema.Types.ObjectId;
  _id: string;
  paymentAmount: number;
  currency: Currencies;
  paymentProvider: PaymentProviders;
  senderIdNumber: number;
  senderAccountNumber: number;
  recipientAccountNumber: number;
  paymentCode: string;
  isVerified: boolean;
  isVerificationPending: boolean;
  createdAt: Date;
  // verifiedBy?: User;
}

export interface PaymentInsert {
  paymentAmount: number;
  currency: Currencies;
  paymentProvider: PaymentProviders;
  senderIdNumber: number;
  senderAccountNumber: number;
  recipientAccountNumber: number;
  paymentCode: string;

  isVerified?: boolean;
  isVerificationPending?: boolean;
  createdAt?: Date;
}

export const currencies = z.enum(['Rand'], {
  required_error: 'Currency is required',
});
export type Currencies = z.infer<typeof currencies>;

export const paymentProviders = z.enum(['Swift'], {
  required_error: 'Payment Provider is required',
});

export type PaymentProviders = z.infer<typeof paymentProviders>;
