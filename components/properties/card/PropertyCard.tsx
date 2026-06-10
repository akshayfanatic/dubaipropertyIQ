'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Bath, Bed, Building2, MapPin, Maximize } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { cn } from '@/lib/utils';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import type { PropertyListItem } from '@/types/property';
import type { ImageObject } from '@/types/images';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';
import { getPropertyStatusBadgeConfig, staticImages } from '@/config';
import { PropertySaveButton } from '@/components/properties/PropertySaveButton';

interface PropertyCardProps {
  property: PropertyListItem;
  className?: string;
  wishlistSlot?: ReactNode;
}

export function PropertyCard({ property, className, wishlistSlot }: PropertyCardProps) {
  const photos = property.photos as ImageObject[];
  const firstImage = photos?.[0]?.url || staticImages.fallback.property;
  const status = getPropertyStatusBadgeConfig(property.status);
  const city = Array.isArray(property.city) ? property.city[0] : (property.city as { name: string; slug: string } | undefined);
  const cityName = city?.name || 'Dubai';
  const category = property.category?.[0]?.name || 'Property';
  const developer = Array.isArray(property.developer) ? property.developer[0] : property.developer;
  const developerLogo = typeof developer?.logo_url === 'string' ? developer.logo_url : developer?.logo_url?.url;
  const developerName = developer?.name || 'Dubai Property IQ';
  const propertyHref = `/properties/${property.slug}`;
  const bedroomLabel = property.bedrooms > 0 ? `${property.bedrooms} ${property.bedrooms === 1 ? 'Bed' : 'Beds'}` : 'Studio';

  return (
    <Card
      className={cn(
        'card-entrance group relative h-[360px] w-full overflow-hidden rounded-xl border border-border bg-muted p-0 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-[380px] xl:h-[400px]',
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden">
        <ImageWithFallback src={firstImage} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/45 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background/85 via-background/10 to-transparent" />

        <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-1.5">
          <Badge className={cn('rounded-md border-0 px-2.5 py-1 text-[10px] font-bold shadow-sm', status.className)}>{status.label}</Badge>
          {property.status === 'off_plan' && (
            <Badge className="rounded-md border-0 bg-slate-950/65 px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm backdrop-blur-sm">Delivery Date: Coming Soon</Badge>
          )}
          {property.golden_visa_eligible && <GoldenVisaBadge variant="gradient-soft" className="bg-background/92 px-2.5 py-1 shadow-sm" />}
        </div>

        <div className="absolute right-3 top-3 z-10">{wishlistSlot ?? <PropertySaveButton propertyId={property.id} />}</div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-primary-foreground">
          <div className="mb-2 space-y-1">
            <div className="inline-flex max-w-28 items-center rounded-md bg-background/95 px-2 py-1.5 shadow-sm">
              {developerLogo ? (
                <ImageWithFallback src={developerLogo} alt={developerName} width={96} height={28} className="h-6 w-auto object-contain" />
              ) : (
                <span className="truncate text-[12px] font-bold uppercase tracking-wide text-foreground">{developerName}</span>
              )}
            </div>

            <Link
              href={propertyHref}
              scroll={true}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <h3 className="line-clamp-1 text-[20px] font-bold leading-6 drop-shadow-sm transition-colors group-hover:text-primary-100">{property.title}</h3>
            </Link>

            <div className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-primary-foreground/85">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {cityName} | {property.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-primary-foreground/90">
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                <span>{bedroomLabel}</span>
              </span>
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1 border-l border-primary-foreground/25 pl-2">
                  <Bath className="h-3.5 w-3.5" />
                  <span>
                    {property.bathrooms} Bath{property.bathrooms === 1 ? '' : 's'}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1 border-l border-primary-foreground/25 pl-2">
                <Building2 className="h-3.5 w-3.5" />
                <span>{category}</span>
              </span>
              {property.size_sqft > 0 && (
                <span className="flex items-center gap-1 border-l border-primary-foreground/25 pl-2">
                  <Maximize className="h-3.5 w-3.5 group-hover:animate-float-x" />
                  <span>{formatSize(property.size_sqft)} sqft</span>
                </span>
              )}
            </div>
          </div>

          <div className="mb-2 space-y-0.5">
            <p className="text-[12px] font-medium text-primary-foreground/85">Launch price:</p>
            <p className="text-[20px] font-bold leading-6 drop-shadow-sm">{formatPrice(property.price_aed).replace(/^AED\s?/, '')} AED</p>
            {property.status === 'off_plan' && <span className="inline-flex rounded-full bg-background/95 px-2.5 py-1 text-[12px] font-bold text-primary shadow-sm">Payment Plan: Ask agent</span>}
          </div>

          <PropertyWhatsAppButton
            property={property}
            variant="card"
            className="h-9 rounded-lg border-0 bg-background/95 text-sm font-bold text-primary shadow-sm hover:bg-background hover:text-primary [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-primary"
          />
        </div>
      </div>
    </Card>
  );
}
