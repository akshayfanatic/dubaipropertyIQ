import { Suspense } from 'react';
import { PropertiesList } from './_components/PropertiesList';
import { PropertiesListSkeleton } from './_components/PropertiesListSkeleton';
import { PropertyFilters } from '@/types';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    property_type?: string;
    status?: string;
    bedrooms?: string;
    min_price?: string;
    max_price?: string;
    min_size?: string;
    max_size?: string;
    golden_visa_eligible?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): PropertyFilters {
  return {
    search: params.search || undefined,
    property_type: params.property_type && params.property_type !== 'all' ? (params.property_type as PropertyFilters['property_type']) : undefined,
    status: params.status && params.status !== 'all' ? (params.status as PropertyFilters['status']) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    min_size: params.min_size ? Number(params.min_size) : undefined,
    max_size: params.max_size ? Number(params.max_size) : undefined,
    golden_visa_eligible: params.golden_visa_eligible === 'true',
  };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);

  // Use key to force remount when filters change - triggers Suspense
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<PropertiesListSkeleton />}>
      <PropertiesList filters={filters} />
    </Suspense>
  );
}
