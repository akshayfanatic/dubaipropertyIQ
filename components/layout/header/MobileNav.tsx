import Link from 'next/link';
import { Building2, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import { AuthSection } from '@/components/modals/auth/auth-section';
import type { HeaderMenus, NavigationSection } from '@/lib/db/menus/queries';

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  pathname: string;
  menus?: HeaderMenus;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-1 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</div>;
}

function MobileSectionAccordion({ section, value, pathname }: { section: NavigationSection; value: string; pathname: string }) {
  return (
    <AccordionItem value={value} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <AccordionTrigger className="min-h-12 px-4 py-3 text-base font-semibold text-foreground hover:bg-accent hover:no-underline data-[state=open]:bg-accent">{section.title}</AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        <div className="grid gap-1 pt-1">
          {section.href ? (
            <Link href={section.href} className="flex min-h-10 items-center rounded-md bg-primary/10 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15">
              View all {section.title}
            </Link>
          ) : null}

          {section.links.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-10 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-primary/10 font-medium text-primary',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function MobileNav({ navItems, pathname, menus }: MobileNavProps) {
  const topLevelLinks = menus?.topLevelLinks ?? navItems;
  const exploreSections = menus?.explore.sections ?? [];
  const resourceSections = menus?.resources.sections ?? [];

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[88vw] max-w-sm gap-0 p-0 sm:w-100">
          <SheetHeader className="border-b border-border px-4 py-5 pr-12">
            <SheetTitle className="flex items-center gap-3 text-base">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Building2 className="h-5 w-5" />
              </span>
              <span>
                <span className="block leading-5">Dubai Property IQ</span>
                <span className="mt-1 block text-sm font-normal text-muted-foreground">Property intelligence menu</span>
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">Browse Explore, Resources, account links, and property tools.</SheetDescription>
          </SheetHeader>

          <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
            <div className="mb-6 grid gap-2">
              <SectionLabel>Navigation</SectionLabel>
              {topLevelLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex min-h-12 items-center rounded-xl border border-border bg-card px-4 text-base font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-accent',
                    pathname === item.href && 'bg-primary/10 text-primary',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {(exploreSections.length > 0 || resourceSections.length > 0) && (
              <div className="grid gap-6">
                {exploreSections.length > 0 && (
                  <div>
                    <SectionLabel>Explore</SectionLabel>
                    <Accordion type="multiple" className="grid gap-2">
                      {exploreSections.map((section) => (
                        <MobileSectionAccordion key={section.title} section={section} value={`explore-${section.title}`} pathname={pathname} />
                      ))}
                    </Accordion>
                  </div>
                )}

                {resourceSections.length > 0 && (
                  <div>
                    <SectionLabel>Resources</SectionLabel>
                    <Accordion type="multiple" className="grid gap-2">
                      {resourceSections.map((section) => (
                        <MobileSectionAccordion key={section.title} section={section} value={`resources-${section.title}`} pathname={pathname} />
                      ))}
                    </Accordion>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 border-t border-border pt-4">
              <AuthSection />
            </div>
          </nav>

          <div className="border-t border-border bg-background px-6 py-4">
            <PropertyWhatsAppButton variant="primary" className="min-h-12 w-full rounded-xl" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
