import AccountDetails from '@/components/account-details';
import PaymentDialog from '@/components/payment-dialog';
import { Separator } from '@/components/shadcn-ui/separator';

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="max-h-screen h-screen  flex flex-col gap-5">
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 p-4 pb-0 gap-5 place-items-center grid-rows-2 sm:grid-rows-1">
        <span className="col-start-1 text-lg sm:text-2xl font-bold">
          Your Payments
        </span>
        <span className="col-start-1 sm:col-start-2 col-span-2 sm:col-span-1 justify-self-center w-full sm:w-max">
          <PaymentDialog />
        </span>
        <span className="col-start-2 sm:col-start-3 row-start-1 text-sm sm:text-lg justify-self-end sm:justify-self-center">
          <AccountDetails />
        </span>
      </div>

      <Separator className="w-3/4 mx-auto" />

      <div className="grow sm:h-full overflow-auto ">{children}</div>
    </section>
  );
}
