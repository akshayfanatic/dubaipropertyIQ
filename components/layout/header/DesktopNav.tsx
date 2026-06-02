import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { AuthSection } from '@/components/modals/auth/auth-section';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import type { HeaderMenus, NavigationSection } from '@/lib/db/menus/queries';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
  pathname: string;
  menus?: HeaderMenus;
  isHeroHeader?: boolean;
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
      { label: 'Terms & Conditions', href: '/pages/terms-conditions' },
      { label: 'Cookie Policy', href: '/pages/cookie-policy' },
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

function isDeveloperSection(section: NavigationSection) {
  return section.title.toLowerCase().includes('developer');
}

function mergeResourceSections(resourceSections: NavigationSection[], developerSections: NavigationSection[]) {
  const resourceTitles = new Set(resourceSections.map((section) => section.title.toLowerCase()));
  const missingDeveloperSections = developerSections.filter((section) => !resourceTitles.has(section.title.toLowerCase()));

  return [...resourceSections, ...missingDeveloperSections];
}

function getDesktopNavItemClasses(isHeroHeader?: boolean) {
  return cn(
    'inline-flex h-9 items-center justify-center rounded-md bg-transparent px-3 text-sm font-semibold transition-colors focus-visible:ring-ring/50 data-[active=true]:!text-primary data-[active=true]:hover:!text-primary data-[active=true]:focus:!text-primary data-[state=open]:bg-accent data-[state=open]:!text-primary',
    isHeroHeader
      ? 'text-white/85 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active=true]:bg-white/10'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground data-[active=true]:bg-accent',
  );
}

function MegaMenuLink({ item, compact = false }: { item: NavItem; compact?: boolean }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className={cn(
          'block rounded-lg px-2.5 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          compact ? 'py-1.5 leading-4' : 'py-2 leading-5',
        )}
      >
        {item.label}
      </Link>
    </NavigationMenuLink>
  );
}

function SearchImageSlot() {
  return (
    <NavigationMenuLink asChild>
      <Link
        href="/search"
        aria-label="Search properties"
        className="group relative hidden min-h-[180px] overflow-hidden rounded-xl border border-primary/15 bg-muted shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:block"
      >
        <Image src="/assets/images/property-home.jpg" alt="Dubai property search" fill sizes="230px" className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        <span className="absolute inset-0 bg-linear-to-t from-foreground/75 via-foreground/20 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 p-4">
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground/80">Property search</span>
          <span className="mt-1 block text-base font-bold leading-5 text-primary-foreground">Find Dubai homes</span>
          <span className="mt-2 inline-flex rounded-md bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">Open search</span>
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

function MegaMenuPanel({ sections }: { sections: NavigationSection[] }) {
  return (
    <div className="w-[min(calc(100vw_-_2rem),640px)] rounded-2xl bg-popover p-5 text-popover-foreground shadow-xl">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_230px]">
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <div key={section.title} className="min-w-0">
              {section.href ? (
                <NavigationMenuLink asChild>
                  <Link href={section.href} className="mb-1.5 block text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-primary">
                    {section.title}
                  </Link>
                </NavigationMenuLink>
              ) : (
                <p className="mb-1.5 text-sm font-semibold text-foreground">{section.title}</p>
              )}
              <div className="grid gap-0.5">
                {section.links.map((item) => (
                  <MegaMenuLink key={`${section.title}-${item.href}-${item.label}`} item={item} compact />
                ))}
              </div>
            </div>
          ))}
        </div>
        <SearchImageSlot />
      </div>
    </div>
  );
}

function ResourcesMenuPanel({ sections }: { sections: NavigationSection[] }) {
  return (
    <div className="w-[min(calc(100vw_-_2rem),640px)] rounded-2xl bg-popover p-5 text-popover-foreground shadow-xl">
      <div className="grid min-h-[180px] grid-cols-3 gap-4">
        {sections.map((section) => (
          <div key={section.title} className="min-w-0">
            <p className="mb-1.5 text-sm font-semibold text-foreground">{section.title}</p>
            <div className="grid gap-0.5">
              {section.links.map((item) => (
                <MegaMenuLink key={`${section.title}-${item.href}-${item.label}`} item={item} compact />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DesktopNav({ navItems, pathname, menus, isHeroHeader }: DesktopNavProps) {
  const topLevelLinks = menus?.topLevelLinks ?? (navItems.length > 0 ? navItems : directLinks);
  const rawExploreSections = menus?.explore.sections ?? fallbackExploreSections;
  const developerSections = rawExploreSections.filter(isDeveloperSection);
  const exploreSections = rawExploreSections.filter((section) => !isDeveloperSection(section));
  const resourceSections = mergeResourceSections(menus?.resources.sections ?? fallbackResourceSections, developerSections);
  const desktopNavItemClasses = getDesktopNavItemClasses(isHeroHeader);

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={desktopNavItemClasses}>Explore</NavigationMenuTrigger>
              <NavigationMenuContent className="left-0 rounded-2xl border bg-popover p-0 shadow-xl">
                <MegaMenuPanel sections={exploreSections} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={desktopNavItemClasses}>Resources</NavigationMenuTrigger>
              <NavigationMenuContent className="left-0 rounded-2xl border bg-popover p-0 shadow-xl">
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

      <div className="hidden items-center gap-2 lg:flex">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={cn(
            'size-10 rounded-[11px] border transition-all hover:-translate-y-0.5',
            isHeroHeader
              ? 'border-white/20 bg-white/10 text-white hover:bg-primary hover:text-primary-foreground'
              : 'border-border bg-muted text-primary hover:bg-primary hover:text-primary-foreground',
          )}
        >
          <Link href="/search" aria-label="Search properties">
            <Search className="size-4" />
          </Link>
        </Button>
        <AuthSection />
      </div>
    </>
  );
}
