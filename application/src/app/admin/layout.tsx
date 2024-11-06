import AccountDetails from '@/components/account-details';
import { Separator } from '@/components/shadcn-ui/separator';
import { getSession } from '@/lib/session';
import { NavBarItems } from './nav-bar-items';

export default async function AdminPaymentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <section className="max-h-screen h-screen  flex flex-col gap-5">
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 p-4 pb-0 gap-5 place-items-center grid-rows-2 sm:grid-rows-1">
        <div className="col-start-1 text-lg sm:text-2xl font-bold flex">
          <NavBarItems isAdmin={session?.isAdmin} />
        </div>

        <span className="col-start-2 sm:col-start-3 row-start-1 text-sm sm:text-lg justify-self-end sm:justify-self-center">
          <AccountDetails />
        </span>
      </div>

      <Separator className="w-3/4 mx-auto" />

      <div className="grow sm:h-full overflow-auto ">{children}</div>
    </section>
  );
}
