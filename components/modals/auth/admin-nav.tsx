'use client';

import Link from 'next/link';
import { LayoutDashboard, User, LogOut, Home } from 'lucide-react';
import { logout } from '@/app/(auth)/auth/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/user';
import { ProfileDropdown } from '@/components/dashboard/admin/profile-dropdown';

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
    <>
      {/* Desktop: Dropdown Menu */}
      <div className="hidden md:block">
        <ProfileDropdown user={user} />
      </div>

      {/* Mobile: Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Avatar className="h-8 w-8 ring-2 ring-primary">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-70">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              <SheetDescription className="sr-only">Admin dashboard, profile settings and sign out option</SheetDescription>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium tracking-tight">{displayName}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wide">Admin</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-40">{user?.email}</p>
                </div>
              </div>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-4">
              <Link href="/dashboard/admin" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-primary/10 transition-colors">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span>Dashboard</span>
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-primary/10 transition-colors">
                <User className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </Link>
              <form action={logout}>
                <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </form>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
