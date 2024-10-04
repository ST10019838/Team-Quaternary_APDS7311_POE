"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnyARecord } from "dns";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  username: z
    .string({
      required_error: "Name is required",
    })
    .min(3, { message: "Must be 3 or more characters long" })
    .max(50, { message: "Must be 50 or fewer characters long" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Must be 8 or more characters long" })
    .max(50, { message: "Must be 50 or fewer characters long" }),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const router = useRouter();

  // Mutations
  const mutation = useMutation({
    mutationFn: async ({ username, password }: LoginForm) => {
      try {
        console.log("MUTATION", { username, password });
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            username,
            password,
          }
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
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // 1. Define the login form
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
    mutation.mutate(values);
  }

  // 3. create the form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <span className="text-red-500">{error}</span>}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
