import React from 'react';
import SearchFilters from '@/components/search/SearchFilters';
import SidebarFilters from '@/components/search/SidebarFilters';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Typewriter } from '@/components/shared/Typewriter';
import { FilterSchema } from '@/components/search/types';

interface SearchPageLayoutProps {
  children: React.ReactNode;
  params: Promise<Partial<FilterSchema>>;
}

export default async function SearchPageLayout({ children }: SearchPageLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="bg-backgroung">
        <WidgetCard className="max-w-295 mx-auto" contentClassNames="p-0 gap-4 p-4 px-8 space-y-4">
          <h1 className=" font-semibold text-3xl">
            <Typewriter text="Search Properties in UAE" loop speed={150} />
          </h1>
          <SearchFilters />
        </WidgetCard>
      </div>

      <div className="max-w-295 mx-auto px-4 py-8">
        <div className="flex gap-8 ">
          <WidgetCard className="max-w-xs w-full shrink-0 max-h-fit">
            <SidebarFilters />
          </WidgetCard>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
