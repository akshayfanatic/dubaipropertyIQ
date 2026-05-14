import Link from 'next/link';
import { Bath, Bed, MapPin, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import type { PropertyListItem } from '@/types/property';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { cn } from '@/lib/utils';
import type { ImageObject } from '@/types/images';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';

interface PropertyCardProps {
  property: PropertyListItem;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-primary/95 text-primary-foreground' },
  sold: { label: 'Sold', className: 'bg-muted/95 text-muted-foreground' },
  reserved: { label: 'Reserved', className: 'bg-accent/95 text-accent-foreground' },
  off_plan: { label: 'Off Plan', className: 'bg-secondary/95 text-secondary-foreground' },
};

export function PropertyCard({ property }: PropertyCardProps) {
  const photos = property.photos as ImageObject[];
  const firstImage = photos?.[0]?.url || '/assets/images/placeholder.jpg';
  const city = Array.isArray(property.city) ? property.city[0] : (property.city as { name: string; slug: string } | undefined);
  const cityName = city?.name || 'Location';
  const status = statusConfig[property.status] || { label: property.status, className: 'bg-muted/95 text-muted-foreground' };

  return (
    <Card className="group overflow-hidden rounded-xl border bg-card p-0 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <Link href={`/properties/${property.slug}`} className="grid min-h-72 grid-cols-1 md:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="relative min-h-64 overflow-hidden bg-muted md:min-h-full">
          <ImageWithFallback src={firstImage} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" fallbackClassName="bg-muted" />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/55 via-foreground/10 to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-foreground/10" />
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            <Badge className={cn('rounded-lg px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm', status.className)}>{status.label}</Badge>
            {property.golden_visa_eligible && <GoldenVisaBadge variant="gradient-soft" />}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-5 p-4 sm:p-5 lg:p-6">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold text-primary">{formatPrice(property.price_aed)}</p>
                <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-6 transition-colors group-hover:text-primary">{property.title}</h3>
              </div>
              <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground sm:max-w-44 sm:justify-end">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{cityName}</span>
              </div>
            </div>

            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{property.description}</p>

            <div className="flex w-fit flex-wrap items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-sm font-medium text-foreground">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  {property.bathrooms}
                </span>
              )}
              {property.size_sqft > 0 && (
                <span className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-muted-foreground" />
                  {formatSize(property.size_sqft)} sqft
                </span>
              )}
            </div>
          </div>

          <PropertyWhatsAppButton property={property} variant="card" className="shadow-sm hover:shadow-md" />
        </div>
      </Link>
    </Card>
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
