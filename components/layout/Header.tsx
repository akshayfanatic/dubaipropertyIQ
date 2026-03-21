'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { AuthSection } from '../modals/auth/auth-section';

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
  sticky?: boolean;
}

const defaultNavItems = [
  { label: 'Properties', href: '/properties' },
  { label: 'Services', href: '/services' },
  { label: 'Agents', href: '/agents' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header({ logo, navItems = defaultNavItems, sticky = true }: HeaderProps) {
  const pathname = usePathname();

  const logoSrc = logo?.src;
  const logoAlt = logo?.alt ?? 'Dubai Property IQ';
  const logoHref = logo?.href ?? '/';

  return (
    <header className={cn('w-full border-b border-border bg-background/90 backdrop-blur-sm', sticky && 'sticky top-0 z-50')}>
      <div className="container mx-auto flex h-20.25 items-center justify-between px-4 lg:px-8">
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

        {/* Navigation - Center (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn('text-sm font-medium transition-colors hover:text-foreground', pathname === item.href ? 'text-foreground' : 'text-muted-foreground')}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section - Right (Desktop) */}
        <div className="hidden md:block">
          <AuthSection />
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
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Hamburger Menu Content</SheetDescription>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('text-lg font-medium transition-colors hover:text-foreground px-4', pathname === item.href ? 'text-foreground' : 'text-muted-foreground')}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border mt-4 mx-4">
                  <AuthSection />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
