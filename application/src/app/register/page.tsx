'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';

// Validation schema for the registration form
const registerFormSchema = z.object({
  fullname: z
    .string({
      required_error: 'Full Name is required',
    })
    .regex(new RegExp(/^[A-Z][a-zA-Z]{3,}(?: [A-Z][a-zA-Z]*){0,2}$/), {
      message:
        'Words must start with uppercase letters, separated by 0 to 2 spaces. First name must be at least 3 characters long. No special characters allowed.',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(100, { message: 'Must be 100 or fewer characters long' }),
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
  idNumber: z
    .string({
      required_error: 'ID Number is required',
    })
    .regex(new RegExp(/^\d+$/), { message: 'Must be a number' })
    .min(13, { message: 'Must be 13 digits long' })
    .max(13, { message: 'Must be 13 digits long' }),
  accountNumber: z
    .string({
      required_error: 'Account Number is required',
    })
    .regex(new RegExp(/^\d+$/), { message: 'Must be a number' })
    .min(9, { message: 'Must be 9 or more digits long' }) // More than a 9 digit number
    .max(12, { message: 'Must be 12 or fewer digits long' }), // Less than a 12 digit number
  password: z.string({
    required_error: 'Password is required',
  }),
});

type RegisterForm = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutations for handling form submission
  const mutation = useMutation({
    mutationFn: async (registerForm: RegisterForm) => {
      try {
        setIsSubmitting(() => true);

        const response = await axios.post('/auth/register', {
          fullname: registerForm.fullname,
          username: registerForm.username,
          idNumber: registerForm.idNumber,
          accountNumber: parseInt(registerForm.accountNumber),
          password: registerForm.password,
        });

        toast({
          title: 'User Successfully Created!',
          description: 'Log in to continue',
        });

        setIsSubmitting(() => false);
        router.push('/login');
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Initialize form with validation
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome to Scammer get Scammed!
        </h2>
        <p className="text-center text-gray-600">
          Please fill in your details to register.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID number" {...field} />
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
