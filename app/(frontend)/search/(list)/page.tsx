import { Suspense } from 'react';
import { SearchResults, SearchResultsSkeleton } from '@/components/search/SearchResults';

export type SearchParams = {
  location?: string;
  q?: string;
  categories?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string | string[];
  golden_visa_eligible?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // Create a key from search params to force Suspense remount on changes
  const searchKey = JSON.stringify(params);

  return (
    <Suspense fallback={<SearchResultsSkeleton />} key={searchKey}>
      <SearchResults {...params} />
    </Suspense>
  );
}
