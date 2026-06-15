import { Suspense } from 'react';
import { SearchResults, SearchResultsSkeleton } from '@/components/search/SearchResults';

export type SearchParams = {
  location?: string;
  q?: string;
  categories?: string;
  bedrooms?: string;
  status?: string;
  sort?: string;
  areas?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  amenities?: string | string[];
  developer_id?: string;
  golden_visa_eligible?: string;
  is_featured?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchKey = JSON.stringify(params);

  return (
    <Suspense fallback={<SearchResultsSkeleton />} key={searchKey}>
      <SearchResults {...params} />
    </Suspense>
  );
}
