import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { AuthSection } from '@/components/modals/auth/auth-section';
import { buttonVariants } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import type { HeaderMenus, NavigationSection } from '@/lib/db/menus/queries';

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
  pathname: string;
  menus?: HeaderMenus;
}

const fallbackExploreSections: NavigationSection[] = [
  {
    title: 'Popular Areas',
    href: '/areas/dubai',
    links: [
      { label: 'Dubai Marina', href: '/areas/dubai/dubai-marina' },
      { label: 'Downtown Dubai', href: '/areas/dubai/downtown-dubai' },
      { label: 'Business Bay', href: '/areas/dubai/business-bay' },
      { label: 'Palm Jumeirah', href: '/areas/dubai/palm-jumeirah' },
    ],
  },
  {
    title: 'Properties',
    href: '/search',
    links: [
      { label: 'Apartments', href: '/search?property_type=apartment' },
      { label: 'Villas', href: '/search?property_type=villa' },
      { label: 'Townhouses', href: '/search?property_type=townhouse' },
      { label: 'Land', href: '/search?property_type=land' },
    ],
  },
];

const directLinks: NavItem[] = [
  { label: 'Search', href: '/search' },
  { label: 'Mortgage', href: '/calculators/mortgage-calculator' },
  { label: 'Rent vs Buy', href: '/calculators/rent-vs-buy-calculator' },
];

const fallbackResourceSections: NavigationSection[] = [
  {
    title: 'Guides',
    links: [
      { label: 'Buying Guide', href: '/pages/buying-guide' },
      { label: 'Investment Guide', href: '/pages/investment-guide' },
      { label: 'Golden Visa Guide', href: '/pages/golden-visa-guide' },
      { label: 'Dubai Area Guide', href: '/areas/dubai' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Dubai Property IQ', href: '/about' },
      { label: 'Customer Account', href: '/customer' },
      { label: 'Privacy Policy', href: '/pages/privacy-policy' },
      { label: 'Terms & Conditions', href: '/pages/terms-and-conditions' },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  const hrefPath = href.split('?')[0];

  if (hrefPath === '/') {
    return pathname === '/';
  }

  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

function MegaMenuLink({ item }: { item: NavItem }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className="block rounded-md px-0 py-1.5 text-sm leading-5 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {item.label}
      </Link>
    </NavigationMenuLink>
  );
}

function MegaMenuPanel({ sections }: { sections: NavigationSection[] }) {
  return (
    <div className="w-[min(92vw,840px)] rounded-xl bg-popover p-5 text-popover-foreground">
      <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-8">
        {/* Explore link columns */}
        <div className="grid grid-cols-3 gap-8">
          {sections.map((column) => (
            <div key={column.title} className="min-w-0">
              {column.href ? (
                <NavigationMenuLink asChild>
                  <Link href={column.href} className="mb-3 block text-sm font-semibold text-foreground underline underline-offset-2 hover:text-primary">
                    {column.title}
                  </Link>
                </NavigationMenuLink>
              ) : (
                <p className="mb-3 text-sm font-semibold text-foreground">{column.title}</p>
              )}

              <div className="grid gap-1">
                {column.links.map((item) => (
                  <MegaMenuLink key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Property image panel */}
        <NavigationMenuLink asChild>
          <Link
            href="/search"
            className="group block overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="relative block aspect-[4/3] overflow-hidden">
              <Image src="/assets/images/property-home.jpg" alt="Dubai property interior" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </span>
            <span className="block p-3">
              <span className="block text-sm font-semibold leading-5 text-foreground">Browse properties</span>
              <span className="mt-1 block text-xs leading-4 text-muted-foreground">Search available Dubai listings</span>
            </span>
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function ResourcesMenuPanel({ sections }: { sections: NavigationSection[] }) {
  return (
    <div className="w-[min(92vw,720px)] rounded-xl bg-popover p-5 text-popover-foreground">
      <div className="grid grid-cols-[1fr_1fr_240px] gap-8">
        {sections.map((column) => (
          <div key={column.title} className="min-w-0">
            <p className="mb-3 text-sm font-semibold text-foreground">{column.title}</p>
            <div className="grid gap-1">
              {column.links.map((item) => (
                <MegaMenuLink key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}

        <Link
          href="/about"
          className="group relative min-h-48 overflow-hidden rounded-xl border border-border bg-muted transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image src="/assets/images/hero-bg.jpg" alt="Dubai Property IQ about page preview" fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/35 to-transparent" />
          <span className="relative flex min-h-48 flex-col justify-end p-4 text-primary-foreground">
            <span className="mb-3 inline-flex w-fit rounded-md bg-background/95 px-2.5 py-1 text-xs font-semibold text-primary">About us</span>
            <span className="block text-lg font-semibold leading-6">Dubai Property IQ</span>
            <span className="mt-2 block text-sm leading-5 text-primary-foreground/85">How we help buyers and investors compare Dubai property decisions.</span>
            <span className="mt-4 text-sm font-semibold text-primary-foreground">Read our story</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function DesktopNav({ navItems, pathname, menus }: DesktopNavProps) {
  const topLevelLinks = menus?.topLevelLinks ?? (navItems.length > 0 ? navItems : directLinks);
  const exploreSections = menus?.explore.sections ?? fallbackExploreSections;
  const resourceSections = menus?.resources.sections ?? fallbackResourceSections;

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/70">
                Explore
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0 translate-x-0 rounded-xl border bg-popover p-0 shadow-lg">
                <MegaMenuPanel sections={exploreSections} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/70">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-1/2 -translate-x-1/2 rounded-xl border bg-popover p-0 shadow-lg">
                <ResourcesMenuPanel sections={resourceSections} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {topLevelLinks.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild active={isActive}>
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        'h-9 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-ring/50',
                        isActive && 'bg-accent text-primary',
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="hidden md:block">
        <AuthSection />
      </div>
    </>
  );
}
