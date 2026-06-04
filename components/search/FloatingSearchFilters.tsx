'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SearchFilters from '@/components/search/SearchFilters';
import SidebarFilters from '@/components/search/SidebarFilters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FloatingSearchFiltersProps {
  targetId: string;
}

export function FloatingSearchFilters({ targetId }: FloatingSearchFiltersProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/94 px-4 py-3 shadow-lg shadow-foreground/10 backdrop-blur-md transition-all duration-300 sm:px-6 lg:px-8',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      )}
      aria-hidden={!isVisible}
    >
      <div className="mx-auto hidden max-w-5xl rounded-xl border border-border/70 bg-card p-2 shadow-md shadow-foreground/8 lg:block [&_button]:text-foreground [&_input]:text-foreground **:data-placeholder:text-muted-foreground">
        <SearchFilters />
      </div>

      <Sheet>
        <div className="mx-auto flex max-w-5xl justify-end lg:hidden">
          <SheetTrigger asChild>
            <Button className="h-11 shrink-0 self-end px-4" aria-label="Open search filters">
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
          </SheetTrigger>
        </div>

        <SheetContent side="bottom" className="max-h-[86vh] rounded-t-2xl p-0" aria-describedby="mobile-search-filters-description">
          <SheetHeader className="border-b border-border px-4 py-4 pr-12 text-left">
            <SheetTitle>Search filters</SheetTitle>
            <SheetDescription id="mobile-search-filters-description">Refine properties by location, type, and budget.</SheetDescription>
          </SheetHeader>

          <div className="space-y-5 overflow-y-auto px-4 py-4 [&_button]:text-foreground [&_input]:text-foreground **:data-placeholder:text-muted-foreground">
            <SearchFilters />
            <div className="border-t border-border pt-5">
              <SidebarFilters />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
