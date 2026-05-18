import { Suspense } from 'react';
import { PropertiesSkeleton } from './layout';
import { getProperties } from '@/lib/db/properties/queries';
import { DeveloperPropertyCard } from '@/components/developers/card/DeveloperPropertyCard';
import type { ImageObject } from '@/types/images';
import type { PropertyListItem } from '@/types/property';
import { formatPrice } from '@/lib/utils/price';
import { parsePropertyStatus } from '@/types/enums';
import { Pagination } from '@/components/shared/pagination';

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
          <DeveloperPropertyCard key={property.id} {...getDeveloperPropertyCardProps(property)} />
        ))}
      </div>
      {data.total > data.pageSize && <Pagination total={data.total} page={data.page} pageSize={data.pageSize} />}
    </div>
  );
}

function getDeveloperPropertyCardProps(property: PropertyListItem) {
  const photos = property.photos as ImageObject[] | null;
  const city = Array.isArray(property.city) ? property.city[0] : property.city;
  const category = Array.isArray(property.category) ? property.category[0] : property.category;
  const developer = Array.isArray(property.developer) ? property.developer[0] : property.developer;
  const developerLogo = developer?.logo_url as ImageObject | null | undefined;

  return {
    imageSrc: photos?.[0]?.url || '/assets/images/placeholder.jpg',
    developerLogoSrc: developerLogo?.url,
    developerName: developer?.name,
    title: property.title,
    slug: property.slug,
    location: city?.name || 'Dubai',
    beds: property.bedrooms > 0 ? String(property.bedrooms) : 'Studio',
    propertyType: category?.name || 'Property',
    price: formatPrice(property.price_aed),
    status: property.status,
  };
}
