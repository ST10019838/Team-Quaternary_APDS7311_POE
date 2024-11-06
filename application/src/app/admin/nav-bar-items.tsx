'use client';

import { Button } from '@/components/shadcn-ui/button';
import { Separator } from '@/components/shadcn-ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBarItems({ isAdmin }: { isAdmin?: boolean }) {
  const path = usePathname();

  return (
    <div className="flex gap-2 w-full">
      <Button
        variant={path.endsWith('payments-verification') ? 'default' : 'ghost'}
        size="sm"
        asChild
      >
        <Link
          href="/admin/payments-verification"
          className={cn('flex items-center gap-2')}
        >
          Payment Verification
        </Link>
      </Button>

      {isAdmin && (
        <>
          <Separator className="h-3/4 w-0.5 my-auto" />
          <Button
            variant={path.endsWith('user-management') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link
              href="/admin/user-management"
              className={cn('flex items-center gap-2')}
            >
              User Management
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
