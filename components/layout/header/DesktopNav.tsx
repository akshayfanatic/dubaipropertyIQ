import Link from 'next/link';

import { cn } from '@/lib/utils';
import { AuthSection } from '@/components/modals/auth/auth-section';

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
  pathname: string;
}

export function DesktopNav({ navItems, pathname }: DesktopNavProps) {
  return (
    <>
      {/* Navigation Links - Center */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={cn('text-sm font-medium transition-colors hover:text-foreground', pathname === item.href ? 'text-foreground' : 'text-muted-foreground')}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Auth Section - Right */}
      <div className="hidden md:block">
        <AuthSection />
      </div>
    </>
  );
}
