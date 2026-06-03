import React from 'react';
import SearchFilters from '@/components/search/SearchFilters';
import SidebarFilters from '@/components/search/SidebarFilters';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { PageBanner } from '@/components/shared/PageBanner';
import { FloatingSearchFilters } from '@/components/search/FloatingSearchFilters';

interface SearchPageLayoutProps {
  children: React.ReactNode;
}

export default async function SearchPageLayout({ children }: SearchPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div id="search-banner">
        <PageBanner
          imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop"
          alt="Modern luxury property exterior"
          heightClassName="min-h-[540px] sm:min-h-[460px] lg:min-h-[420px]"
          overlayClassName="bg-foreground/55"
          contentClassName="max-w-294 mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
          className="mb-7 sm:mb-8"
        >
          <div className="w-full space-y-6 text-primary-foreground">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <div className="**:text-primary-foreground [&_button:hover]:text-primary-foreground/85 [&_a:hover]:text-primary-foreground/85 **:[[role=separator]]:text-primary-foreground/70 [&>div]:mb-0 [&>div>div]:bg-primary-foreground/50">
                <PublicBreadCrumb />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">Search Dubai properties</h1>
                <p className="max-w-2xl text-sm leading-6 text-primary-foreground/88 sm:text-base">Compare listings by location, property type, budget, amenities, and Golden Visa eligibility.</p>
              </div>
            </div>

            <div className="w-full max-w-5xl">
              <section
                className="rounded-[22px] border border-border/80 bg-card/95 p-3 shadow-xl shadow-foreground/20 backdrop-blur-md sm:p-4 [&_button]:text-foreground [&_input]:text-foreground **:data-placeholder:text-muted-foreground"
                aria-label="Primary search filters"
              >
                <SearchFilters />
              </section>
            </div>
          </div>
        </PageBanner>
      </div>

      <FloatingSearchFilters targetId="search-banner" />

      <div className="max-w-294 mx-auto flex w-full flex-col gap-6 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10 pt-10">
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-8">
          <aside className="hidden rounded-[22px] border bg-card p-4 shadow-sm lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto sm:p-5">
            <SidebarFilters />
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
