'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseBusiness, Heart, LogOut, UserRound } from 'lucide-react';

import { logout } from '@/app/(auth)/auth/actions';
import { cn } from '@/lib/utils';

const customerSections = [
  {
    href: '/customer',
    label: 'Profile details',
    icon: UserRound,
  },
  {
    href: '/customer/saved-properties',
    label: 'Saved properties',
    icon: Heart,
  },
  {
    href: '/become-partner/application-status',
    label: 'Partner application',
    icon: BriefcaseBusiness,
  },
] as const;

export function CustomerAccountNav() {
  const pathname = usePathname();

  return (
    <nav
      className="-mx-3 mt-3 flex max-w-[calc(100%+1.5rem)] gap-2 overflow-x-auto border-t border-border/80 px-3 pt-3 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:max-w-none lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      aria-label="Account sections"
    >
      {customerSections.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-11 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full',
              isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}

      <form action={logout} className="shrink-0 lg:w-full">
        <button
          type="submit"
          className="flex min-h-11 w-full items-center gap-2.5 whitespace-nowrap rounded-md px-3 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2"
        >
          <LogOut className="h-4 w-4 shrink-0 text-destructive" />
          <span className="truncate">Logout</span>
        </button>
      </form>
    </nav>
  );
}
