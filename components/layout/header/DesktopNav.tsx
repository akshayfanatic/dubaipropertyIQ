import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { AuthSection } from '@/components/modals/auth/auth-section';
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
    title: 'Featured Properties',
    href: '/search',
    links: [
      { label: 'Dubai Marina Apartment', href: '/search' },
      { label: 'Downtown Dubai Residence', href: '/search' },
      { label: 'Palm Jumeirah Villa', href: '/search' },
      { label: 'Business Bay Investment', href: '/search' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Emaar Properties', href: '/developers/emaar-properties' },
      { label: 'DAMAC Properties', href: '/developers/damac-properties' },
      { label: 'Nakheel', href: '/developers/nakheel' },
      { label: 'Meraas', href: '/developers/meraas' },
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

const desktopNavItemClasses =
  'inline-flex h-9 items-center justify-center rounded-md bg-transparent px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground focus-visible:ring-ring/50 data-[active=true]:bg-accent data-[active=true]:!text-primary data-[active=true]:hover:!text-primary data-[active=true]:focus:!text-primary data-[state=open]:bg-accent data-[state=open]:!text-primary';

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
  const developerSection = sections.find((section) => section.title.toLowerCase() === 'developers');
  const developerPromoHref = developerSection?.links[0]?.href ?? '/search';

  return (
    <div className="max-h-[min(70vh,620px)] w-[min(calc(100vw-2rem),560px)] overflow-y-auto rounded-xl bg-popover p-4 text-popover-foreground xl:w-210 xl:p-5">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-8">
        {/* Explore link columns */}
        <div className="grid grid-cols-3 gap-5 xl:gap-8">
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
            href={developerPromoHref}
            className="group hidden overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:block"
          >
            <span className="relative block aspect-4/3 overflow-hidden">
              <Image src="/assets/images/property-home.jpg" alt="Dubai property interior" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </span>
            <span className="block p-3">
              <span className="block text-sm font-semibold leading-5 text-foreground">Explore developers</span>
              <span className="mt-1 block text-xs leading-4 text-muted-foreground">Review developer profiles and linked projects</span>
            </span>
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function ResourcesMenuPanel({ sections }: { sections: NavigationSection[] }) {
  return (
    <div className="max-h-[min(70vh,620px)] w-[min(calc(100vw-2rem),480px)] overflow-y-auto rounded-xl bg-popover p-4 text-popover-foreground xl:w-180 xl:p-5">
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-[1fr_1fr_240px] xl:gap-8">
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
          className="group relative hidden min-h-48 overflow-hidden rounded-xl border border-border bg-muted transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:block"
        >
          <Image src="/assets/images/hero-bg.jpg" alt="Dubai Property IQ about page preview" fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/35 to-transparent" />
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
              <NavigationMenuTrigger className={desktopNavItemClasses}>Explore</NavigationMenuTrigger>
              <NavigationMenuContent className="left-0 translate-x-0 rounded-xl border bg-popover p-0 shadow-lg">
                <MegaMenuPanel sections={exploreSections} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={desktopNavItemClasses}>Resources</NavigationMenuTrigger>
              <NavigationMenuContent className="left-1/2 -translate-x-1/2 rounded-xl border bg-popover p-0 shadow-lg">
                <ResourcesMenuPanel sections={resourceSections} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {topLevelLinks.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild active={isActive}>
                    <Link href={item.href} className={cn(desktopNavItemClasses, isActive && 'bg-accent text-primary!')}>
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
