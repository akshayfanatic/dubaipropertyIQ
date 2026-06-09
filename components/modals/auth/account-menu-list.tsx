'use client';

import Link from 'next/link';
import { LogOut, type LucideIcon } from 'lucide-react';

import { logout } from '@/app/(auth)/auth/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/user';

export type AccountMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

interface AccountMenuListProps {
  user?: UserProfile | null;
  fallbackName: string;
  items: AccountMenuItem[];
  badge?: string;
  avatarClassName?: string;
  fallbackClassName?: string;
}

function getUserDisplay(user: UserProfile | null | undefined, fallbackName: string) {
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || fallbackName;
  const initials = displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    displayName,
    initials,
  };
}

export function AccountMenuList({ user, fallbackName, items, badge, avatarClassName, fallbackClassName }: AccountMenuListProps) {
  const { displayName, initials } = getUserDisplay(user, fallbackName);
  const avatarUrl = user?.user_metadata?.avatar_url ?? undefined;

  return (
    <section className="rounded-2xl border border-border/80 bg-card p-3 shadow-sm">
      {/* Account identity stays visible on mobile instead of hiding actions behind an avatar dropdown. */}
      <div className="flex min-w-0 items-center gap-3 px-1 pb-3">
        <Avatar className={cn('h-11 w-11 ring-2 ring-primary/20', avatarClassName)}>
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className={cn('bg-primary/10 text-sm font-semibold text-primary', fallbackClassName)}>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            {badge ? <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">{badge}</span> : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-2 border-t border-border/70 pt-3" aria-label={`${fallbackName} account`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-12 items-center gap-3 rounded-xl border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <item.icon className="h-4 w-4 text-primary" />
            <span>{item.label}</span>
          </Link>
        ))}

        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-destructive/15 bg-destructive/5 px-4 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </form>
      </nav>
    </section>
  );
}
