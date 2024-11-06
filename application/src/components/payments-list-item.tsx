'use client';

import Payment, { PaymentInsert } from '@/models/Payment';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './shadcn-ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn-ui/tooltip';

import { Separator } from '@radix-ui/react-select';
import { Badge } from '@/components/shadcn-ui/badge';
import { ScrollArea } from '@/components/shadcn-ui/scroll-area';
import { Button } from './shadcn-ui/button';
import { Clock, Pencil, ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import PaymentDialog from './payment-dialog';
import DeletePaymentDialog from './delete-payment-dialog';
import { format } from 'date-fns';
import PaymentVerificationDialog from './payment-verification-dialog';

export default function PaymentsListItem({
  payment,
  useEmployee,
}: {
  payment: Payment;
  useEmployee?: boolean;
}) {
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold truncate">
          Payment {payment._id}
        </CardTitle>
        <CardDescription>
          Created At: {format(payment.createdAt, 'dd MMMM yyyy - HH:mm:ss')}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <ScrollArea className="h-52">
          <div className="pr-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Provider
              </span>
              <Badge variant="secondary">{payment.paymentProvider}</Badge>
            </div>
            <Separator />

            <div className="flex justify-between items-center ">
              <span className="text-sm font-medium text-muted-foreground">
                Amount
              </span>
              <span className="text-sm sm:text-lg font-bold">
                {payment.paymentAmount.toFixed(2) + ' '}
                {payment.currency.toUpperCase()}
              </span>
            </div>
            <Separator />

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Payment Code
              </span>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {payment.paymentCode}
              </p>
            </div>
            <Separator />

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Recipient Account
              </span>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {payment.recipientAccountNumber}
              </p>
            </div>
            <Separator />

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Sender Account
              </span>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {payment.senderAccountNumber}
              </p>
            </div>
            <Separator />

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Sender ID Number
              </span>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {payment.senderIdNumber}
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div
          className={cn(
            'w-full',
            payment.isVerificationPending && 'flex flex-col gap-3'
          )}
        >
          {useEmployee ? (
            <div className="flex gap-2 w-full">
              <PaymentVerificationDialog
                payment={payment}
                verifyPayment={false}
              />

              <PaymentVerificationDialog
                payment={payment}
                verifyPayment={true}
              />
            </div>
          ) : payment.isVerificationPending ? (
            <>
              <Badge className="flex w-full py-1 px-3 gap-2 items-center justify-center text-white">
                <Clock />
                Pending Verification
              </Badge>

              <div className="w-full flex gap-3">
                <TooltipProvider delayDuration={500}>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <DeletePaymentDialog
                        payment={payment}
                        dialogTrigger={
                          <Button
                            variant="outline"
                            disabled={!payment.isVerificationPending}
                            className="w-full"
                          >
                            <Trash2 />
                          </Button>
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Payment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={500}>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <PaymentDialog
                        payment={payment}
                        dialogTrigger={
                          <Button
                            variant="outline"
                            disabled={!payment.isVerificationPending}
                            className="w-full"
                          >
                            <Pencil />
                          </Button>
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Payment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          ) : (
            <Badge
              className={cn(
                'flex gap-2 py-1 px-3 text-white w-full items-center justify-center',
                payment.isVerified
                  ? 'bg-green-500 hover:bg-green-500/75'
                  : 'bg-red-500 hover:bg-red-500/75'
              )}
            >
              {payment.isVerified ? <ShieldCheck /> : <ShieldX />}
              {payment.isVerified ? 'Verified' : 'Denied'}
            </Badge>
          )}
        </div>

        {/* <Button className="w-full">Verify</Button> */}
      </CardFooter>
    </Card>
  );
}
