'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  logo?: {
    src?: string;
    alt?: string;
    href?: string;
  };
  navItems?: Array<{
    label: string;
    href: string;
  }>;
  ctaButton?: {
    label?: string;
    href?: string;
    onClick?: () => void;
  };
  sticky?: boolean;
}

const defaultNavItems = [
  { label: 'Properties', href: '/properties' },
  { label: 'Services', href: '/services' },
  { label: 'Agents', href: '/agents' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header({
  logo,
  navItems = defaultNavItems,
  ctaButton,
  sticky = true,
}: HeaderProps) {
  const pathname = usePathname();

  const logoSrc = logo?.src;
  const logoAlt = logo?.alt ?? 'Dubai Property IQ';
  const logoHref = logo?.href ?? '/';

  const ctaLabel = ctaButton?.label ?? 'Schedule Viewing';

  return (
    <header
      className={cn(
        'w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm',
        sticky && 'sticky top-0 z-50'
      )}
    >
      <div className="container mx-auto flex h-20.25 items-center justify-between px-4 lg:px-8">
        {/* Logo - Left */}
        <Link href={logoHref} className="flex items-center gap-0.5">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <span className="text-base font-normal tracking-wide">
              <span className="text-black">Dubai</span>
              <span className="text-slate-400">PropertyIQ</span>
            </span>
          )}
        </Link>

        {/* Navigation - Center (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-slate-900',
                pathname === item.href
                  ? 'text-slate-900'
                  : 'text-slate-500'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button - Right (Desktop) */}
        <div className="hidden md:block">
          {ctaButton?.href ? (
            <Button
              className="h-13 rounded-lg bg-[#0077B6] px-8 py-4 text-sm font-semibold text-white hover:bg-[#0066A0]"
              asChild
            >
              <Link href={ctaButton.href}>{ctaLabel}</Link>
            </Button>
          ) : (
            <Button
              className="h-13 rounded-lg bg-[#0077B6] px-8 py-4 text-sm font-semibold text-white hover:bg-[#0066A0]"
              onClick={ctaButton?.onClick}
            >
              {ctaLabel}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-slate-900',
                      pathname === item.href
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-200 mt-4">
                  {ctaButton?.href ? (
                    <Button
                      className="w-full h-13 rounded-lg bg-[#0077B6] px-8 py-4 text-sm font-semibold text-white hover:bg-[#0066A0]"
                      asChild
                    >
                      <Link href={ctaButton.href}>{ctaLabel}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-13 rounded-lg bg-[#0077B6] px-8 py-4 text-sm font-semibold text-white hover:bg-[#0066A0]"
                      onClick={ctaButton?.onClick}
                    >
                      {ctaLabel}
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
