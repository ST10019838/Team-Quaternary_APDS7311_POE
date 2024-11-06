import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { User } from '@/models/User';
import { toast } from 'sonner';
import { getSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function useUsers() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const session = await getSession();

      if (session === null) router.push('/login');

      const { data } = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      return data as User[];
    },
    refetchInterval: 1000 * 60 * 2, // refetch every 2 mins
    refetchIntervalInBackground: false,
  });

  const userCreation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (newUser: User) => {
      const session = await getSession();

      if (session === null) router.push('/login');

      await axios.post('/users/register', newUser, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      userCreation.reset();

      toast.success('Successfully Added User');
    },
    onError: (error) => {
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  const userUpdation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (userToUpdate: User) => {
      const session = await getSession();

      if (session === null) router.push('/login');

      await axios.put(`/users/update/${userToUpdate._id}`, userToUpdate, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      userUpdation.reset();

      toast.success('Successfully Updated User');
    },
    onError: (error) => {
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  const userDeletion = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async (userToDelete: User) => {
      const session = await getSession();

      if (session === null) router.push('/login');

      await axios.delete(`/users/delete/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      userDeletion.reset();

      toast.success('Successfully Deleted User');
    },
    onError: (error) => {
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  return {
    users,
    userCreation,
    userUpdation,
    userDeletion,
  };
}
