'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

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
  const isHomePage = pathname === '/';
  const [hasScrolledHome, setHasScrolledHome] = useState(false);

  const logoSrc = logo?.src;
  const logoAlt = logo?.alt ?? 'Dubai Property IQ';
  const logoHref = logo?.href ?? '/';
  const isScrolled = !isHomePage || hasScrolledHome;
  const isHeroHeader = isHomePage && !isScrolled;

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const updateHeaderState = () => setHasScrolledHome(window.scrollY > 40);
    const frame = window.requestAnimationFrame(updateHeaderState);
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateHeaderState);
    };
  }, [isHomePage]);

  return (
    <header
      className={cn(
        'top-0 z-50 w-full border-b transition-all duration-300 ease-out',
        isHomePage ? 'fixed' : sticky && 'sticky',
        isHeroHeader ? 'border-transparent bg-transparent' : 'border-border bg-background/92 shadow-sm backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-[74px] w-[min(92%,1440px)] items-center justify-between gap-4">
        <Link href={logoHref} className={cn('flex items-center gap-2.5 font-semibold tracking-tight transition-colors', isHeroHeader ? 'text-white' : 'text-foreground')}>
          {logoSrc ? (
            <Image src={logoSrc} alt={logoAlt} width={132} height={36} className="h-9 w-auto" />
          ) : (
            <>
              <span className="grid size-9 place-items-center rounded-[11px] bg-primary text-primary-foreground shadow-md shadow-primary/25">
                <Building2 className="size-5" />
              </span>
              <span className="text-lg">
                Dubai<span className="text-primary">Property</span>IQ
              </span>
            </>
          )}
        </Link>

        <DesktopNav navItems={navItems} pathname={pathname} menus={menus} isHeroHeader={isHeroHeader} />

        <MobileNav navItems={navItems} pathname={pathname} menus={menus} isHeroHeader={isHeroHeader} />
      </div>
    </header>
  );
}
