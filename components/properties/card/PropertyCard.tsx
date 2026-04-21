import Link from 'next/link';
import { PropertyItemGallery } from './PropertyItemGallery';
import { PropertyItemContent } from './PropertyItemContent';
import type { PropertyListItem } from '@/types/property';

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
