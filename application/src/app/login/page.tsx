'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/shadcn-ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { saveSession } from '@/lib/session';
import { Session } from '@/models/Session';

const loginFormSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .regex(new RegExp(/^[a-zA-Z0-9_]+$/), {
      message:
        'Only alphanumric characters and underscores are allowed. No spaces are allowed either.',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(50, { message: 'Must be 50 or fewer characters long' }),
  accountNumber: z
    .string({
      required_error: 'Account number is required',
    })
    .regex(new RegExp(/^\d+$/), { message: 'Must be a number' })
    .min(9, { message: 'Must be 9 or more digits long' }) // More than a 9 digit number
    .max(12, { message: 'Must be 12 or fewer digits long' }), // Less than a 12 digit number,
  password: z.string({
    required_error: 'Password is required',
  }),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutations
  const mutation = useMutation({
    mutationFn: async ({ username, accountNumber, password }: LoginForm) => {
      try {
        setIsSubmitting(() => true);

        const { data }: { data: Session } = await axios.post('/auth/login', {
          username,
          accountNumber,
          password,
        });

        await saveSession(data);
        setIsSubmitting(() => false);

        // localStorage.setItem('token', data.data.token);
        router.push(data.isAdmin || data.isEmployee ? '/admin/payments-verification' : '/payments');
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
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome back to Scammer get Scammed!
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-center gap-2">
              {error && <span className="text-red-500">{error}</span>}

              <Button type="submit" className="w-full">
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </Form>

        {/* <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
