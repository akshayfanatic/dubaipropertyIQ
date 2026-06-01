import { Suspense } from 'react';
import { PropertiesSkeleton } from './layout';
import { getProperties } from '@/lib/db/properties/queries';
import { parsePropertyStatus } from '@/types/enums';
import { Pagination } from '@/components/shared/pagination';
import { PropertyCard } from '@/components/properties/card';

type DeveloperPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function DeveloperPage({ params, searchParams }: DeveloperPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  // Use searchParams as a key to trigger Suspense on every query change
  const key = JSON.stringify(sParams);

  return (
    <Suspense key={key} fallback={<PropertiesSkeleton />}>
      <DeveloperPropertiesList slug={slug} query={sParams?.query} status={sParams?.status} page={sParams?.page} />
    </Suspense>
  );
}

async function DeveloperPropertiesList({ slug, query, status, page }: { slug: string; query?: string; status?: string; page?: string }) {
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const { success, data, message } = await getProperties({
    developer_slug: slug,
    q: query,
    status: parsePropertyStatus(status),
    page: pageNumber,
  });

  if (!success || !data) {
    return <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{message || 'Properties not found'}</div>;
  }

  if (data.data.length === 0) {
    return <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">No properties found for this developer.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {data.total > data.pageSize && <Pagination total={data.total} page={data.page} pageSize={data.pageSize} />}
    </div>
  );
}
