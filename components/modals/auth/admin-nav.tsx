'use client';

import Link from 'next/link';
import { LayoutDashboard, User, LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/auth/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/user';

interface AdminNavProps {
  user?: UserProfile | null;
}

export function AdminNav({ user }: AdminNavProps) {
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Admin';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/60 bg-popover/95 backdrop-blur-sm shadow-lg">
        <DropdownMenuLabel className="font-normal px-3 py-2.5">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium tracking-tight">{displayName}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wide">Admin</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem asChild className="px-3 py-2 rounded-lg mx-1 focus:bg-primary/10">
          <Link href="/dashboard/admin">
            <LayoutDashboard className="mr-2.5 h-4 w-4 text-primary" />
            <span className="text-sm">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="px-3 py-2 rounded-lg mx-1 focus:bg-primary/10">
          <Link href="/dashboard/profile">
            <User className="mr-2.5 h-4 w-4 text-primary" />
            <span className="text-sm">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/60" />
        <form action={logout}>
          <DropdownMenuItem asChild className="px-3 py-2 rounded-lg mx-1 focus:bg-destructive/10">
            <button type="submit" className="w-full flex items-center">
              <LogOut className="mr-2.5 h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">Sign out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
