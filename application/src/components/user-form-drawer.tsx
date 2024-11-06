// The following code was adapted from a v0 staticGenerationAsyncStorage
// Link: https://v0.dev/
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/shadcn-ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select';

import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/shadcn-ui/drawer';
import { User } from '@/models/User';
import { CirclePlus, Loader2, Pencil, X } from 'lucide-react';
import { ReactNode } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Switch } from './shadcn-ui/switch';

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
  isEmployee: z.boolean().default(false),
});

const updationFormSchema = registerFormSchema.partial({ password: true });

type RegisterForm = z.infer<typeof registerFormSchema>;
type UpdationForm = z.infer<typeof updationFormSchema>;

interface Props {
  mode?: 'create' | 'update';
  userToUpdate?: User;
  trigger?: ReactNode;
  isOpen?: boolean;
  onOpenChanged?: (open: boolean) => void;
  itemAction: UseMutationResult<void, Error, User, unknown>;
}

export default function UserFormDrawer({
  mode = 'create',
  userToUpdate,
  trigger,
  isOpen,
  onOpenChanged,
  itemAction,
}: Props) {
  // const { skillLevels } = useSkillLevels()
  // const { userRoles } = useUserRoles()

  const form = useForm<RegisterForm | UpdationForm>({
    resolver: zodResolver(
      mode === 'create' ? registerFormSchema : updationFormSchema
    ),
    defaultValues:
      mode === 'update' && userToUpdate
        ? {
            fullname: userToUpdate?.fullname,
            username: userToUpdate?.username,
            idNumber: userToUpdate?.idNumber.toString(),
            accountNumber: userToUpdate?.accountNumber.toString(),
            // email: userToUpdate?.email,
            isEmployee: userToUpdate?.isEmployee,
            // profilePicture: { url: '', alt: '' },
          }
        : {
            fullname: '',
            username: '',
            idNumber: undefined,
            accountNumber: undefined,
            // email: userToUpdate?.email,
            isEmployee: false,
            // profilePicture: { url: '', alt: '' },
          },
  });

  const onSubmit = (data: RegisterForm | UpdationForm) => {
    const user: User = {
      fullname: data.fullname,
      username: data.username,
      idNumber: parseInt(data.idNumber),
      accountNumber: parseInt(data.accountNumber),
      password: data.password,
      isEmployee: data.isEmployee,
    };

    if (mode === 'create') itemAction.mutate(user);
    else if (userToUpdate) {
      user._id = userToUpdate?._id;
      itemAction.mutate(user);
    }

    form.reset();

    if (itemAction.isIdle && !itemAction.isError && onOpenChanged) {
      onOpenChanged(false);
    }
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChanged}>
      <DrawerTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" className="hidden h-8 lg:flex">
            <CirclePlus className="mr-1 size-4" />
            Add User
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent
        className="fixed inset-x-auto bottom-2 right-2 top-2 mt-0 flex w-[350px] rounded-md outline-none after:!content-none"
        style={
          {
            '--initial-transform': 'calc(100% + 8px)',
          } as React.CSSProperties
        }
      >
        <DrawerHeader>
          <DrawerTitle>
            {mode === 'create' ? 'Add A' : 'Update'} User
          </DrawerTitle>
          <DrawerDescription>
            Fill in the following fields to{' '}
            {mode === 'create'
              ? 'add a new user to the application'
              : "update a user's details"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="h-full overflow-auto p-5">
          <Form {...form}>
            <form className="space-y-5">
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
                      <Input
                        placeholder="Enter your account number"
                        {...field}
                      />
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

              <FormField
                control={form.control}
                name="isEmployee"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Is Employee</FormLabel>
                      <FormDescription>
                        Is this user and employee?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={itemAction.isPending}
          >
            {mode === 'create' ? (
              itemAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Adding User...</span>
                </>
              ) : (
                <>
                  <CirclePlus className="mr-1 size-4" />
                  <span>Add User</span>
                </>
              )
            ) : itemAction.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Updating User...</span>
              </>
            ) : (
              <>
                <Pencil className="mr-1 size-4" />
                <span>Update User</span>
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
