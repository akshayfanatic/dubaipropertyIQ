'use client';
import Link from 'next/link';
import { Bed, Building2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import { Button } from '@/components/ui/button';

export interface DeveloperPropertyCardProps {
  imageSrc: string;
  developerLogoSrc?: string;
  developerName?: string;
  title: string;
  slug?: string;
  location: string;
  beds: string;
  propertyType: string;
  price: string;
  currency?: string;
  paymentPlansCount?: number;
  status?: string;
  deliveryDate?: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Available: { label: 'Available', className: 'bg-primary/95 text-primary-foreground backdrop-blur-sm' },
  Ready: { label: 'Ready', className: 'bg-accent/90 text-accent-foreground backdrop-blur-sm' },
  'Off-Plan': { label: 'Off Plan', className: 'bg-secondary/90 text-secondary-foreground backdrop-blur-sm' },
};

export function DeveloperPropertyCard({
  imageSrc,
  developerLogoSrc,
  developerName = 'EMAAR',
  title,
  slug = '#',
  location,
  beds,
  propertyType,
  price,
  paymentPlansCount,
  status,
  deliveryDate,
  className,
}: DeveloperPropertyCardProps) {
  const statusBadge = status ? statusConfig[status] || { label: status, className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm' } : null;
  const propertyHref = slug !== '#' ? `/properties/${slug}` : '#';

  return (
    <div className="group block">
      <Card className={cn('relative  overflow-hidden rounded-xl aspect-4/3 border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1', className)}>
        {/* Background Image */}
        <div className="absolute inset-0 bg-muted">
          <ImageWithFallback src={imageSrc} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-col justify-start items-start gap-2 z-10">
          {statusBadge && <Badge className={cn('px-3 py-1 text-xs font-semibold rounded-lg shadow-sm', statusBadge.className)}>{statusBadge.label}</Badge>}
          {deliveryDate && <Badge className="px-3 py-1 text-xs font-semibold rounded-lg shadow-sm bg-black/60 text-white backdrop-blur-sm border-0">Delivery Date: {deliveryDate}</Badge>}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
          <div className="mb-3">
            {/* Developer Logo or Name */}
            {developerLogoSrc ? (
              <div className="backdrop-blur-sm px-3 py-2 rounded-md inline-flex items-center mb-2 shadow-sm">
                <ImageWithFallback src={developerLogoSrc} alt={developerName} width={128} height={36} className="object-contain h-9 w-auto max-w-40" />
              </div>
            ) : (
              <div className="backdrop-blur-sm px-3 py-2 rounded-md inline-block mb-2 shadow-sm">
                <span className="text-black font-serif tracking-widest text-sm font-bold uppercase">{developerName}</span>
              </div>
            )}

            <h3 className="text-lg font-bold mb-1.5 line-clamp-1 drop-shadow-sm">{title}</h3>

            <p className="text-sm font-medium mb-1 drop-shadow-sm text-primary-foreground/90 line-clamp-1">{location}</p>

            <p className="text-xl font-bold mb-2.5 drop-shadow-sm">{price}</p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground bg-primary/10 backdrop-blur-sm rounded-lg px-2.5 py-1.5 w-fit">
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4" strokeWidth={2.5} /> {beds}
                </span>
                <span className="text-primary-foreground/40">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" strokeWidth={2.5} /> {propertyType}
                </span>
              </div>

              {paymentPlansCount !== undefined && paymentPlansCount > 0 && (
                <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-white backdrop-blur-sm rounded-lg px-2 py-1.5 w-fit shadow-sm">
                  {paymentPlansCount} Payment Plans
                </div>
              )}
            </div>
          </div>

          {/* Background Strip before WhatsApp */}
          <div className="h-px bg-primary-foreground/20 mb-3" />

          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-lg border-primary-foreground/25 bg-background/95 text-xs font-semibold text-primary shadow-none backdrop-blur-sm transition-all hover:border-primary-foreground/40 hover:bg-background hover:text-primary hover:shadow-sm"
            >
              <Link href={propertyHref}>
                <Eye className="h-3.5 w-3.5" />
                Details
              </Link>
            </Button>
            <PropertyWhatsAppButton
              property={{ title, slug }}
              variant="card"
              className="h-10 rounded-lg border-0 bg-primary text-xs text-primary-foreground shadow-none hover:bg-primary/90 hover:text-primary-foreground hover:shadow-sm [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:fill-primary-foreground"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DeveloperPropertyCardSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-xl aspect-4/3 border border-border shadow-lg animate-pulse">
      <div className="absolute inset-0 bg-gray-200" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/20 to-transparent z-0" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
        <div className="h-6 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
        <div className="h-8 w-1/3 bg-gray-300 rounded" />
        <div className="h-8 w-full bg-gray-300 rounded" />
      </div>
    </Card>
  );
}
