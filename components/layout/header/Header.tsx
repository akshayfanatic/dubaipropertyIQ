'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import type { HeaderMenus } from '@/lib/db/menus/queries';

/* =============================================================================
 * Types & Constants
 * ============================================================================= */

export interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  logo?: {
    src?: string;
    alt?: string;
    href?: string;
  };
  navItems?: NavItem[];
  menus?: HeaderMenus;
  sticky?: boolean;
}

const defaultNavItems: NavItem[] = [
  { label: 'Search', href: '/search' },
  { label: 'Mortgage', href: '/calculators/mortgage-calculator' },
  { label: 'Rent vs Buy', href: '/calculators/rent-vs-buy-calculator' },
];

/* =============================================================================
 * Header Component
 * ============================================================================= */

export default function Header({ logo, navItems = defaultNavItems, menus, sticky = true }: HeaderProps) {
  const pathname = usePathname();

  const logoSrc = logo?.src;
  const logoAlt = logo?.alt ?? 'Dubai Property IQ';
  const logoHref = logo?.href ?? '/';

  return (
    <header className={cn('w-full border-b border-border bg-background/95 backdrop-blur-sm', sticky && 'sticky top-0 z-50')}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo - Left */}
        <Link href={logoHref} className="flex items-center gap-0.5">
          {logoSrc ? (
            <Image src={logoSrc} alt={logoAlt} width={120} height={32} className="h-8 w-auto" />
          ) : (
            <span className="text-base font-normal tracking-wide">
              <span className="text-foreground">Dubai</span>
              <span className="text-muted-foreground">PropertyIQ</span>
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav navItems={navItems} pathname={pathname} menus={menus} />

        {/* Mobile Navigation */}
        <MobileNav navItems={navItems} pathname={pathname} menus={menus} />
      </div>
    </header>
  );
}
