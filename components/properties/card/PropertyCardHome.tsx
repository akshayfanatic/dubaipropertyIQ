'use client';

import Link from 'next/link';
import { Bath, Bed, Building2, Eye, MapPin, Maximize } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { cn } from '@/lib/utils';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import type { PropertyListItem } from '@/types/property';
import type { ImageObject } from '@/types/images';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';

interface PropertyCardHomeProps {
  property: PropertyListItem;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-primary/95 text-primary-foreground backdrop-blur-sm' },
  sold: { label: 'Sold', className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm' },
  reserved: { label: 'Reserved', className: 'bg-accent/90 text-accent-foreground backdrop-blur-sm' },
  off_plan: { label: 'Off Plan', className: 'bg-secondary/90 text-secondary-foreground backdrop-blur-sm' },
};

export function PropertyCardHome({ property, className }: PropertyCardHomeProps) {
  const photos = property.photos as ImageObject[];
  const firstImage = photos?.[0]?.url || '/assets/images/placeholder.jpg';
  const status = statusConfig[property.status] || { label: property.status, className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm' };
  const city = Array.isArray(property.city) ? property.city[0] : (property.city as { name: string; slug: string } | undefined);
  const cityName = city?.name || 'Dubai';
  const category = property.category?.[0]?.name || 'Property';
  const propertyHref = `/properties/${property.slug}`;

  return (
    <Card className={cn('group w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg', className)}>
      <Link href={propertyHref} className="relative block aspect-[16/9] overflow-hidden bg-muted">
        <div className="absolute inset-0">
          <ImageWithFallback src={firstImage} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-foreground/35 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-2">
          <Badge className={cn('rounded-md px-2.5 py-1 text-[11px] font-semibold shadow-sm', status.className)}>{status.label}</Badge>
          <Badge className="rounded-md bg-background/92 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">{category}</Badge>
          {property.golden_visa_eligible && <GoldenVisaBadge variant="gradient-soft" className="bg-background/92 px-2.5 py-1 shadow-sm" />}
        </div>
      </Link>

      <div className="space-y-2.5 p-3">
        <div className="space-y-1">
          <p className="text-base font-bold leading-5 text-foreground">{formatPrice(property.price_aed)}</p>
          <Link href={propertyHref} className="block">
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-4 text-foreground transition-colors group-hover:text-primary">{property.title}</h3>
          </Link>
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{cityName}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-y py-1.5 text-[11px] text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-3 w-3" />
              <span className="font-medium text-foreground">{property.bedrooms}</span>
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-3 w-3" />
              <span className="font-medium text-foreground">{property.bathrooms}</span>
            </span>
          )}
          {property.size_sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-3 w-3" />
              <span className="font-medium text-foreground">{formatSize(property.size_sqft)} sqft</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            <span className="font-medium text-foreground">{category}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-primary/20 bg-card text-xs font-semibold text-primary shadow-none transition-all hover:border-primary/35 hover:bg-primary/10 hover:text-primary hover:shadow-sm"
          >
            <Link href={propertyHref}>
              <Eye className="h-3.5 w-3.5" />
              Details
            </Link>
          </Button>
          <PropertyWhatsAppButton
            property={property}
            variant="card"
            className="h-9 rounded-lg border-0 bg-primary text-xs text-primary-foreground shadow-none hover:bg-primary/90 hover:text-primary-foreground hover:shadow-sm [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:fill-primary-foreground"
          />
        </div>
      </div>
    </Card>
  );
}
