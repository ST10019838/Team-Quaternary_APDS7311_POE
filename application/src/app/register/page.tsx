"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Validation schema for the registration form
const registerFormSchema = z.object({
  fullname: z
    .string({
      required_error: "Full name is required",
    })
    .min(3, { message: "Must be 3 or more characters long" })
    .max(100, { message: "Must be 100 or fewer characters long" }),
  idnumber: z
    .string({
      required_error: "ID number is required",
    })
    .min(13, { message: "Must be 13 digits long" })
    .max(13, { message: "Must be 13 digits long" }),
  accountnumber: z
    .string({
      required_error: "Account number is required",
    })
    .min(10, { message: "Must be 10 digits long" })
    .max(10, { message: "Must be 10 digits long" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Must be 8 or more characters long" })
    .max(50, { message: "Must be 50 or fewer characters long" }),
});

type RegisterForm = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const router = useRouter();

  // Mutations for handling form submission
  const mutation = useMutation({
    mutationFn: async ({ fullname, idnumber, accountnumber, password }: RegisterForm) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          { fullname, idnumber, accountnumber, password }
        );
        localStorage.setItem("token", response.data.token);
        router.push("/");
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Initialize form with validation
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullname: "",
      idnumber: "",
      accountnumber: "",
      password: "",
    },
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
        <p className="text-center text-gray-600">Please fill in your details to register.</p>

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
              name="idnumber"
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
              name="accountnumber"
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

            {error && <span className="text-red-500">{error}</span>}

            <div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
