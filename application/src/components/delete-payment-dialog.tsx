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
} from '@/components/ui/dialog';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import Payment from '@/models/Payment';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSession } from '@/lib/session';

export default function DeletePaymentDialog({
  payment,
  dialogTrigger,
}: {
  payment: Payment;
  dialogTrigger?: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // // Mutations
  const mutation = useMutation({
    mutationFn: async () => {
      const session = await getSession();

      try {
        const response = await axios.delete(`/payments/${payment._id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
          data: {
            isVerificationPending: payment.isVerificationPending,
          },
        });

        setIsDialogOpen(false);

        toast({
          title: 'Payment Successfully Deleted',
        });
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user-payments'] });
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {dialogTrigger ? (
          dialogTrigger
        ) : (
          <Button variant="outline" className="w-full sm:w-max">
            Delete Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Delete Payment</DialogTitle>
          <DialogDescription>Payment: {payment._id}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          Are you sure you want to delete this payment?
          {error && <span className="text-red-500">{error}</span>}
        </div>
        <DialogFooter className="flex flex-row w-full gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-max">
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            className="w-full sm:w-max gap-2"
            onClick={() => mutation.mutate()}
          >
            <Trash2 />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
