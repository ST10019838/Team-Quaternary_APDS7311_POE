'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/shadcn-ui/button';
import { DataTable } from '@/components/shadcn-ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/models/User';
import { DataTableColumnHeader } from '@/components/shadcn-ui/data-table-column-header';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';

import { Separator } from './shadcn-ui/separator';
import UserFormDrawer from './user-form-drawer';
import DeletionDialog from './deletion-dialog';
import { Badge } from './shadcn-ui/badge';
import { cn } from '@/lib/utils';
import useUsers from '@/hooks/useUsers';

// import { Drawer } from 'vaul'

export default function UsersTable() {
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const { users, userCreation, userUpdation, userDeletion } = useUsers();

  const columns: ColumnDef<User>[] = [
    {
      id: 'Fullname',
      accessorKey: 'fullname',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fullname" />
      ),
    },
    {
      id: 'Username',
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
    },
    {
      id: 'ID Number',
      accessorKey: 'idNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID Number" />
      ),
    },
    {
      id: 'Account Number',
      accessorKey: 'accountNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Number" />
      ),
    },
    // {
    //   id: 'IsAdmin',
    //   accessorKey: 'isAdmin',
    //   // The accessor function is used to convert the data to string to enable better filtering
    //   // accessorFn: (row) => `${row.age.toString()}`,
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="IsAdmin" />
    //   ),
    // },
    {
      id: 'UserRole',
      // accessorKey: 'isEmployee',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User Role" />
      ),
      cell: ({ row }) => {
        const isAdmin = row.original?.isAdmin;
        const isEmployee = row.original?.isEmployee;
        const isUser = !isAdmin && !isEmployee;

        return (
          isAdmin != undefined &&
          isEmployee != undefined && (
            <Badge
              variant="outline"
              className={cn(
                isUser && 'border-sky-500 text-sky-500', // User
                isEmployee && 'border-indigo-500 text-indigo-500', // Employee
                isAdmin && 'border-emerald-500 text-emerald-500' // Admin
              )}
            >
              {isUser && 'User'}
              {isEmployee && 'Employee'}
              {isAdmin && 'Admin'}
            </Badge>
          )
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const [formIsOpen, setFormIsOpen] = useState(false);
        const [deletionDialogIsOpen, setDeletionDialogIsOpen] = useState(false);

        // Admin information cannot be modified
        if (row.original.isAdmin) return;

        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => setFormIsOpen(() => true)}>
                  <Pencil className="mr-1 size-4" />
                  Edit User
                </DropdownMenuItem>
                {/* </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => setDeletionDialogIsOpen(() => true)}
                >
                  <Trash2 className="mr-1 size-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DeletionDialog
              nameOfData="user"
              dataId={row.original.username}
              dataToDelete={row.original}
              dialogTrigger={<p></p>}
              isOpen={deletionDialogIsOpen}
              onOpenChanged={setDeletionDialogIsOpen}
              itemDeletion={userDeletion}
            />

            <UserFormDrawer
              mode="update"
              userToUpdate={row.original}
              trigger={<p></p>}
              isOpen={formIsOpen}
              onOpenChanged={(newValue) => setFormIsOpen(() => newValue)}
              itemAction={userUpdation}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="py-10">
      <Card>
        <CardHeader className="flex w-full items-center justify-center">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all of your users here</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mx-auto my-2 w-1/4" />

          <div className="container mx-auto">
            <DataTable
              columns={columns}
              data={typeof users.data === 'undefined' ? [] : users.data}
              isLoading={users.isLoading}
              isError={users.isError}
              error={users.error}
              addItemForm={
                <UserFormDrawer
                  itemAction={userCreation}
                  isOpen={isTableFormOpen}
                  onOpenChanged={(newValue) =>
                    setIsTableFormOpen(() => newValue)
                  }
                />
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
