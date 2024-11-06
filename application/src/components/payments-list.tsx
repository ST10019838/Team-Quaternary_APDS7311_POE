import Payment from '@/models/Payment';
import { useQuery } from '@tanstack/react-query';
import PaymentsListItem from './payments-list-item';
import { Button } from './shadcn-ui/button';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { getSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function PaymentsList({
  useEmployee,
}: {
  useEmployee?: boolean;
}) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [useEmployee ? 'pending-payments' : 'user-payments'],
    queryFn: async () => {
      const session = await getSession();

      if (session === null) router.push('/login');

      const { data } = await axios.get(
        useEmployee
          ? '/payments/pending'
          : `/payments/${session?.accountNumber}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
          // withCredentials: true,
        }
      );
      return data as Payment[];
    },
    refetchInterval: 1000 * 60 * 2, // refetch every 2 mins
    refetchIntervalInBackground: false,
  });

  if (isLoading)
    return (
      <h1 className="flex items-center justify-center w-full ">
        Fetching Payments...
      </h1>
    );

  if (isError)
    return (
      <h1 className="flex items-center justify-center w-full text-red-500">
        Error: {error.message}
      </h1>
    );

  if (data?.length == 0)
    return (
      <h1 className="flex items-center justify-center w-full">
        No payments have been found
      </h1>
    );

  return (
    <div className="w-full grid px-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 place-items-center pb-10">
      {data?.map((payment) => (
        <PaymentsListItem
          key={payment._id}
          payment={payment}
          useEmployee={useEmployee}
        />
      ))}
    </div>
  );
}
