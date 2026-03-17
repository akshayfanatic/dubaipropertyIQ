'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, LayoutDashboard, User, LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/auth/actions';

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/dashboard" className="mr-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden font-semibold sm:inline-block">Dubai Property IQ</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <form action={logout}>
          <button type="submit" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
