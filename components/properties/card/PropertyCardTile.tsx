import Link from 'next/link';
import type { ReactNode } from 'react';
import { Bath, Bed, Building2, Eye, MapPin, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import { Button } from '@/components/ui/button';
import type { PropertyListItem } from '@/types/property';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { cn } from '@/lib/utils';
import type { ImageObject } from '@/types/images';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';
import { getPropertyStatusBadgeConfig, staticImages } from '@/config';
import { PropertySaveButton } from '@/components/properties/PropertySaveButton';

interface PropertyCardTileProps {
  property: PropertyListItem;
  wishlistSlot?: ReactNode;
}

export function PropertyCardTile({ property, wishlistSlot }: PropertyCardTileProps) {
  const photos = property.photos as ImageObject[];
  const firstImage = photos?.[0]?.url || staticImages.fallback.property;
  const city = Array.isArray(property.city) ? property.city[0] : (property.city as { name: string; slug: string } | undefined);
  const cityName = city?.name || 'Location';
  const category = property.category?.[0]?.name || 'Property';
  const developer = property.developer?.[0]?.name;
  const status = getPropertyStatusBadgeConfig(property.status);
  const propertyHref = `/properties/${property.slug}`;

  return (
    <Card className="card-entrance group overflow-hidden rounded-xl border bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="relative min-h-64 overflow-hidden bg-muted lg:min-h-full">
          <Link href={propertyHref} scroll={true} className="absolute inset-0">
            <ImageWithFallback src={firstImage} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" fallbackClassName="bg-muted" />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/50 via-foreground/10 to-transparent" />
          </Link>
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
            <Badge className={cn('rounded-lg px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm', status.className)}>{status.label}</Badge>
            {property.golden_visa_eligible && <GoldenVisaBadge variant="gradient-soft" />}
          </div>
          <div className="absolute right-3 top-3 z-10">{wishlistSlot ?? <PropertySaveButton propertyId={property.id} initialSaved={property.is_saved} />}</div>
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-3 text-xs font-medium text-primary-foreground">
            <span className="rounded-md bg-foreground/55 px-2 py-1 backdrop-blur-sm">{category}</span>
            {photos?.length > 1 && <span className="rounded-md bg-foreground/55 px-2 py-1 backdrop-blur-sm">{photos.length} photos</span>}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-4 p-4 sm:p-5">
          <div className="space-y-3.5">
            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-2xl font-bold leading-8 text-foreground">{formatPrice(property.price_aed)}</p>
                {developer && <span className="text-xs leading-5 text-muted-foreground sm:pt-1">{developer}</span>}
              </div>

              <Link href={propertyHref} scroll={true} className="block">
                <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">{property.title}</h3>
              </Link>

              <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{cityName}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y py-3 text-sm text-muted-foreground">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4" />
                  <span className="font-medium text-foreground">{property.bedrooms}</span>
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4" />
                  <span className="font-medium text-foreground">{property.bathrooms}</span>
                </span>
              )}
              {property.size_sqft > 0 && (
                <span className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4" />
                  <span className="font-medium text-foreground">{formatSize(property.size_sqft)} sqft</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span className="font-medium text-foreground">{category}</span>
              </span>
            </div>

            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{property.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-primary/20 bg-card font-semibold text-primary shadow-none transition-all hover:border-primary/35 hover:bg-primary/10 hover:text-primary hover:shadow-sm"
            >
              <Link href={propertyHref} scroll={true}>
                <Eye className="h-4 w-4 group-hover:animate-float-x" />
                Details
              </Link>
            </Button>
            <PropertyWhatsAppButton
              property={property}
              variant="card"
              className="h-11 rounded-lg border-0 bg-primary text-primary-foreground shadow-none hover:bg-primary/90 hover:text-primary-foreground hover:shadow-sm [&_svg]:fill-primary-foreground"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
