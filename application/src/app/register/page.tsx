// 'use client';

// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/shadcn-ui/button';

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/shadcn-ui/form';
// import { Input } from '@/components/shadcn-ui/input';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useToast } from '@/hooks/use-toast';
// import axios from '@/lib/axios';

// export default function RegisterPage() {
//   const queryClient = useQueryClient();
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Mutations for handling form submission
//   const mutation = useMutation({
//     mutationFn: async (registerForm: RegisterForm) => {
//       try {
//         setIsSubmitting(() => true);

//         const response = await axios.post('/auth/register', {
//           fullname: registerForm.fullname,
//           username: registerForm.username,
//           idNumber: registerForm.idNumber,
//           accountNumber: parseInt(registerForm.accountNumber),
//           password: registerForm.password,
//         });

//         toast({
//           title: 'User Successfully Created!',
//           description: 'Log in to continue',
//         });

//         setIsSubmitting(() => false);
//         router.push('/login');
//       } catch (err: any) {
//         setIsSubmitting(() => false);
//         if (err.response) {
//           setError(err.response.data.message);
//         } else {
//           setError('Something went wrong. Please try again.');
//         }
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });

//   // Initialize form with validation
//   const form = useForm<z.infer<typeof registerFormSchema>>({
//     resolver: zodResolver(registerFormSchema),
//   });

//   function onSubmit(values: z.infer<typeof registerFormSchema>) {
//     mutation.mutate(values);
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-lg">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">
//           Welcome to Scammer get Scammed!
//         </h2>
//         <p className="text-center text-gray-600">
//           Please fill in your details to register.
//         </p>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

//             <div className="flex flex-col items-center gap-2">
//               {error && <span className="text-red-500">{error}</span>}

//               <Button type="submit" className="w-full" disabled={isSubmitting}>
//                 {isSubmitting ? 'Registering...' : 'Register'}
//               </Button>
//             </div>
//           </form>
//         </Form>

//         <div className="text-center">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <a href="/login" className="text-blue-600 hover:underline">
//               Sign In
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
