import Link from 'next/link';

import { cn } from '@/lib/utils';
import { AuthSection } from '@/components/modals/auth/auth-section';
import { buttonVariants } from '@/components/ui/button';

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
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(buttonVariants({ variant: 'link' }), 'hover:text-primary font-semibold px-2 text-base no-underline!', pathname === item.href ? 'text-primary' : 'text-[#111827]')}
          >
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
