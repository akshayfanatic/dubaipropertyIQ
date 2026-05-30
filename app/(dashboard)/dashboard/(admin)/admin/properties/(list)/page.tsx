import { Suspense } from 'react';
import { PropertiesList } from '@/components/dashboard/admin/properties/filter/PropertiesList';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { PropertyFilters } from '@/types';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    property_type?: string;
    city_id?: string;
    city_slug?: string;
    status?: string;
    bedrooms?: string;
    min_price?: string;
    max_price?: string;
    min_size?: string;
    max_size?: string;
    golden_visa_eligible?: string;
    is_featured?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function buildFilters(params: Awaited<PageProps['searchParams']>): PropertyFilters {
  return {
    search: params.search || undefined,
    property_type: params.property_type && params.property_type !== 'all' ? (params.property_type as PropertyFilters['property_type']) : undefined,
    city_id: params.city_id && params.city_id !== 'all' ? params.city_id : undefined,
    city_slug: params.city_slug,
    status: params.status && params.status !== 'all' ? (params.status as PropertyFilters['status']) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    min_size: params.min_size ? Number(params.min_size) : undefined,
    max_size: params.max_size ? Number(params.max_size) : undefined,
    golden_visa_eligible: params.golden_visa_eligible === 'true',
    is_featured: params.is_featured !== undefined ? params.is_featured === 'true' : undefined,
    sortBy: params.sortBy || undefined,
    sortOrder: (params.sortOrder as PropertyFilters['sortOrder']) || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = buildFilters(params);

  // Use key to force remount when filters change - triggers Suspense
  const filterKey = JSON.stringify(filters);

  return (
    <Suspense key={filterKey} fallback={<TableSkeleton columns={8} rows={10} />}>
      <PropertiesList filters={filters} />
    </Suspense>
  );
}
