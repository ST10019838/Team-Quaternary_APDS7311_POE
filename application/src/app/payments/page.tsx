'use client';

import PaymentsList from '@/components/payments-list';
import { Separator } from '@/components/ui/separator';

export default function CustomerPage() {
  return (
    <div className="w-full">
      <PaymentsList />
    </div>
  );
}
