import React from 'react';
import SearchFilters from '@/components/search/SearchFilters';
import SidebarFilters from '@/components/search/SidebarFilters';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';

interface SearchPageLayoutProps {
  children: React.ReactNode;
}

export default async function SearchPageLayout({ children }: SearchPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-295 flex-col gap-5">
        <header className="space-y-3">
          <PublicBreadCrumb />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">Search Dubai properties</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Compare listings by location, property type, budget, amenities, and Golden Visa eligibility.</p>
          </div>
        </header>

        <section className="rounded-xl border bg-card p-3 shadow-sm sm:p-4" aria-label="Primary search filters">
          <SearchFilters />
        </section>

        <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <aside>
            <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
              <SidebarFilters />
            </div>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
