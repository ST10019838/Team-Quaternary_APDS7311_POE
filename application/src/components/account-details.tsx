'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';
import { Button } from './shadcn-ui/button';
import { CircleUserRound, LogOut, UserRound } from 'lucide-react';
import { clearSession, getSession } from '@/lib/session';
import { useState } from 'react';
import { Session } from '@/models/Session';
import { useRouter } from 'next/navigation';

export default function AccountDetails() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<Session>();

  return (
    <DropdownMenu
      onOpenChange={async () => {
        if (currentSession) return;

        const session = await getSession();

        if (session === null) router.push('/login');

        setCurrentSession(() => session!);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full bg-gray-300"
          size={'icon'}
          variant={'ghost'}
        >
          <CircleUserRound className="rounded-full" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex flex-col justify-start items-start gap-1">
          <div>Username</div>
          <div className="bg-muted rounded w-full p-2">
            {currentSession?.username}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-col justify-start items-start gap-1">
          <div>ID</div>
          <div className="bg-muted rounded w-full p-2">
            {currentSession?.idNumber}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-col justify-start items-start gap-1">
          <div>Account</div>
          <div className="bg-muted rounded w-full p-2">
            {currentSession?.accountNumber}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await clearSession();
            router.push('/login');
          }}
          className="flex gap-2"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
