'use client';

import axios from '@/lib/axios';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import Payment, { PaymentInsert } from '@/models/Payment';
import { ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function PaymentVerificationDialog({
  payment,
  verifyPayment,
}: {
  payment: Payment;
  verifyPayment: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // // Mutations
  const mutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(() => true);

      const session = await getSession();

      if (session === null) router.push('/login');

      try {
        const paymentDetails: PaymentInsert = {
          paymentAmount: payment.paymentAmount,
          currency: payment.currency,
          paymentProvider: payment.paymentProvider,

          senderIdNumber: payment.senderIdNumber,
          senderAccountNumber: payment.senderAccountNumber,
          recipientAccountNumber: payment.recipientAccountNumber,
          paymentCode: payment.paymentCode,

          isVerified: verifyPayment,
          isVerificationPending: false,
          createdAt: payment?.createdAt,
        };

        await axios.post(
          `/payments/${verifyPayment ? 'verify' : 'deny'}/${payment._id}`,
          paymentDetails,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        setIsDialogOpen(() => false);
        setIsSubmitting(() => false);

        toast({
          title: `Payment Successfully ${
            verifyPayment ? 'Verified' : 'Denied'
          }`,
        });
      } catch (err: any) {
        setIsSubmitting(() => false);
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {verifyPayment ? (
          <Button
            variant={'outline'}
            className="hover:bg-green-500 hover:text-white flex gap-2 w-full"
          >
            <ShieldCheck />
            Verify
          </Button>
        ) : (
          <Button
            variant={'outline'}
            className="hover:bg-rose-500 hover:text-white flex gap-2 w-full"
          >
            <ShieldX />
            Deny
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{verifyPayment ? 'Verify' : 'Deny'} Payment</DialogTitle>
          <DialogDescription>Payment: {payment._id}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <span>
            Are you sure you want to{' '}
            <span
              className={cn(
                'underline',
                verifyPayment ? 'text-green-500' : 'text-red-500'
              )}
            >
              {verifyPayment ? 'verify' : 'deny'}
            </span>{' '}
            this payment?
          </span>

          {error && <span className="text-red-500">{error}</span>}
        </div>
        <DialogFooter className="flex flex-row w-full gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-max">
              Cancel
            </Button>
          </DialogClose>

          <Button
            className={cn(
              'w-full sm:w-max gap-2 text-white',
              verifyPayment
                ? 'bg-green-500 hover:bg-green-500/75'
                : 'bg-rose-500 hover:bg-rose-500/75'
            )}
            onClick={() => mutation.mutate()}
            disabled={isSubmitting}
          >
            {verifyPayment ? <ShieldCheck /> : <ShieldX />}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
