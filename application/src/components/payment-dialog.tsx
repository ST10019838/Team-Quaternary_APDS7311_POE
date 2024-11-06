'use client';

import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select';
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

import { Input } from '@/components/shadcn-ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnyARecord } from 'dns';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/shadcn-ui/button';
import Payment, {
  currencies,
  PaymentInsert,
  paymentProviders,
} from '@/models/Payment';
import { Regex } from 'lucide-react';
import { Separator } from './shadcn-ui/separator';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { getSession } from '@/lib/session';

const paymentFormSchema = z.object({
  paymentAmount: z.coerce
    .number({
      required_error: 'Payment Amount is required',
      invalid_type_error: 'Payment Amount is required',
    })
    .step(0.01, { message: 'Amount must not be longer than 2 decimals' })
    .positive()
    .finite()
    .max(10000000, { message: 'Amount must not be more than 10 000 000' }),

  // Currency will be selected from a dropdown
  currency: currencies,

  // Currency will be selected from a dropdown
  paymentProvider: paymentProviders,

  // "From Id Number" will be obtained from the user logged in
  // senderIdNumber: z.number({
  //   required_error: 'ID Number is required',
  // }),

  // "From Account Number" will be obtained from the user logged in
  // senderAccountNumber: z
  //   .string({
  //     required_error: 'Account Number is required',
  //   })
  //   .regex(new RegExp(/^\d+$/), { message: 'Must be a number' })
  //   .min(9, { message: 'Must be 9 or more characters long' })
  //   .max(12, { message: 'Must be 12 or fewer characters long' }),

  recipientAccountNumber: z // ADD REGEX to match only numbers
    .string({
      required_error: 'Recipient Account Number is required',
    })
    .regex(new RegExp(/^\d+$/), { message: 'Must be a number' })
    .min(9, { message: 'Must be 9 or more digits long' }) // More than a 9 digit number
    .max(12, { message: 'Must be 12 or fewer digits long' }), // Less than a 12 digit number

  paymentCode: z
    .string({
      required_error: 'Payment Code is required',
    })
    // The following regex was taken from reddit.com
    // Author: ihaxr (https://www.reddit.com/user/ihaxr/)
    // Link: https://www.reddit.com/r/regex/comments/kj102o/allow_special_characters_but_not_spaces/
    .regex(new RegExp(/^[^\s+]+$/), { message: 'No spaces are allowed' })
    .min(8, { message: 'Must be 8 or more characters long' })
    .max(11, { message: 'Must be 11 or fewer characters long' }),
  //
});

type PaymentForm = z.infer<typeof paymentFormSchema>;

export default function PaymentDialog({
  payment,
  dialogTrigger,
}: {
  payment?: Payment;
  dialogTrigger?: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isPerforming, setIsPerforming] = useState(false);

  // Mutations
  const mutation = useMutation({
    mutationFn: async (paymentForm: PaymentForm) => {
      try {
        setIsPerforming(() => true);

        const session = await getSession();

        if (session === null) router.push('/login');

        // Set details to credentials of user logged in
        const paymentDetails: PaymentInsert = {
          paymentAmount: paymentForm.paymentAmount,
          currency: paymentForm.currency,
          paymentProvider: paymentForm.paymentProvider,
          senderIdNumber: session?.idNumber!,
          senderAccountNumber: session?.accountNumber!,
          recipientAccountNumber: parseInt(paymentForm.recipientAccountNumber),
          paymentCode: paymentForm.paymentCode,

          isVerified: payment?.isVerified,
          isVerificationPending: payment?.isVerificationPending,
          createdAt: payment?.createdAt,
        };

        if (payment) {
          await axios.put(`/payments/${payment._id}`, paymentDetails, {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          });
        } else {
          await axios.post('/payments/create', paymentDetails, {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          });
        }

        setIsDialogOpen(() => false);
        setIsPerforming(() => false);

        form.reset();

        toast({
          title: payment
            ? 'Payment Successfully Updated'
            : 'Payment Successfully Created',
        });
      } catch (err: any) {
        setIsPerforming(() => false);

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

  // 1. Define the login form
  // Need to add users credentaials
  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: payment && {
      paymentAmount: payment.paymentAmount,
      currency: payment.currency,
      paymentProvider: payment.paymentProvider,
      // senderIdNumber: payment.senderIdNumber,
      // senderAccountNumber: payment.senderAccountNumber,
      recipientAccountNumber: payment.recipientAccountNumber.toString(),
      paymentCode: payment.paymentCode,
      // senderIdNumber: 129089,
      // senderAccountNumber: '123123123',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {dialogTrigger ? (
            dialogTrigger
          ) : (
            <Button variant="outline" className="w-full sm:w-max">
              Make a payment
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {payment ? 'Edit Payment' : 'International Payment'}
            </DialogTitle>
            <DialogDescription>
              {payment
                ? `Payment: ${payment._id}`
                : 'Send money internationally with ease.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="recipientAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Acount Number</FormLabel>
                    <FormControl>
                      <Input placeholder="XXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4 sm:flex-row justify-between sm:gap-5">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rand">R - Rand</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={'.01'}
                          placeholder="00.00"
                          min={0}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row justify-between sm:gap-5">
                <FormField
                  control={form.control}
                  name="paymentProvider"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Payment Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Swift">Swift</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentCode"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Payment Code</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* <DialogFooter> */}

            <div className="flex flex-col gap-2">
              {error && <span className="text-red-500">{error}</span>}
              <Button type="submit" className="w-full" disabled={isPerforming}>
                {payment
                  ? isPerforming
                    ? 'Editing...'
                    : 'Edit Payment'
                  : isPerforming
                  ? 'Paying Now...'
                  : 'Pay Now'}
              </Button>

              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
          {/* </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </Form>
  );
}
