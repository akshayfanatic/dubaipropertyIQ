import Link from 'next/link';
import { PropertyItemGallery } from './PropertyItemGallery';
import { PropertyItemContent } from './PropertyItemContent';
import type { PropertyListItem } from '@/types/property';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyCardProps {
  property: PropertyListItem;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const city = property.city as { name: string; slug: string } | undefined;
  const cityName = city?.name || 'Location';

  return (
    <div className="group overflow-hidden transition-all hover:shadow-md rounded-lg border bg-card">
      <Link href={`/properties/${property.slug}`} className="flex flex-col sm:flex-row">
        <PropertyItemGallery photos={property.photos || []} title={property.title} goldenVisaEligible={property.golden_visa_eligible} />
        <PropertyItemContent
          title={property.title}
          priceAed={property.price_aed}
          description={property.description}
          cityName={cityName}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          sizeSqft={property.size_sqft}
        />
      </Link>
    </div>
  );
}

export function PropertyCardHomeSkeleton() {
  return (
    <div className="relative rounded-xl aspect-4/3 border border-border bg-muted overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="absolute inset-0" />
      {/* Top badge skeleton */}
      <div className="absolute top-3 left-3">
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      {/* Bottom content overlay skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/50 to-transparent">
        <div className="space-y-2 mb-3">
          <Skeleton className="h-5 w-3/4 bg-white/20" />
          <Skeleton className="h-6 w-1/2 bg-white/20" />
        </div>
        {/* Stats bar skeleton */}
        <Skeleton className="h-7 w-full rounded-lg bg-white/10 mb-3" />
        {/* WhatsApp button skeleton */}
        <Skeleton className="h-11 w-full rounded-lg bg-white/20" />
      </div>
    </div>
  );
}
