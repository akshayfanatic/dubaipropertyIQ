import Link from 'next/link';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { AuthSection } from '@/components/modals/auth/auth-section';

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  pathname: string;
}

export function MobileNav({ navItems, pathname }: MobileNavProps) {
  return (
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
  );
}
