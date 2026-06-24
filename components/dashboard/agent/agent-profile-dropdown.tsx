'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, LogOut, User } from 'lucide-react';
import { logout } from '@/app/(auth)/auth/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth-provider';

export function AgentProfileDropdown() {
  const { user } = useAuth();
  const pathname = usePathname();
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Agent';
  const avatarUrl = user?.user_metadata?.avatar_url ?? undefined;
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/60 bg-popover/95 shadow-lg backdrop-blur-sm">
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium tracking-tight">{displayName}</p>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">Agent</span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem asChild className="mx-1 rounded-lg px-3 py-2 focus:bg-primary/10">
          <Link href="/dashboard/agent">
            <LayoutDashboard className="mr-2.5 h-4 w-4 text-primary" />
            <span className="text-sm">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="mx-1 rounded-lg px-3 py-2 focus:bg-primary/10">
          <Link href="/dashboard/agent/profile">
            <User className="mr-2.5 h-4 w-4 text-primary" />
            <span className="text-sm">Profile</span>
          </Link>
        </DropdownMenuItem>

        {pathname.includes('/dashboard/agent') ? (
          <DropdownMenuItem asChild className="mx-1 rounded-lg px-3 py-2 focus:bg-primary/10">
            <Link href="/">
              <Home className="mr-2.5 h-4 w-4 text-primary" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator className="bg-border/60" />
        <form action={logout}>
          <DropdownMenuItem asChild className="mx-1 rounded-lg px-3 py-2 focus:bg-destructive/10">
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2.5 h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">Sign out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
