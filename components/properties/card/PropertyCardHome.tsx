'use client';

import Link from 'next/link';
import { Bed, Bath, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { cn } from '@/lib/utils';
import type { PropertyListItem } from '@/types/property';
import type { ImageObject } from '@/types/images';

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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi, I'm interested in ${property.title}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <Card className={cn('relative overflow-hidden rounded-xl aspect-[4/3] border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1', className)}>
        {/* Background Image */}
        <div className="absolute inset-0 bg-muted">
          <ImageWithFallback src={firstImage} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>

        {/* Top Bar */}
        <div className="absolute top-3 left-3 right-3 flex justify-start items-start z-10">
          <Badge className={cn('px-3 py-1 text-xs font-semibold rounded-lg shadow-sm', status.className)}>{status.label}</Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
          <div className="mb-3">
            <h3 className="text-lg font-bold mb-1.5 line-clamp-1 drop-shadow-sm">{property.title}</h3>

            <p className="text-xl font-bold mb-2.5 drop-shadow-sm">{formatPrice(property.price_aed)}</p>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground bg-primary/10 backdrop-blur-sm rounded-lg px-2 py-1 w-fit">
              {property.bedrooms > 0 && (
                <>
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5" strokeWidth={2.5} /> {property.bedrooms}
                  </span>
                  <span className="text-primary-foreground/40">•</span>
                </>
              )}
              {property.bathrooms > 0 && (
                <>
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5" strokeWidth={2.5} /> {property.bathrooms}
                  </span>
                  <span className="text-primary-foreground/40">•</span>
                </>
              )}
              {property.size_sqft > 0 && <span>{formatSize(property.size_sqft)} sqft</span>}
            </div>
          </div>

          {/* Background Strip before WhatsApp */}
          <div className="h-px bg-primary-foreground/20 mb-3" />

          {/* WhatsApp Button */}
          <Button
            size="sm"
            onClick={handleWhatsAppClick}
            className="h-11 w-full rounded-lg bg-card hover:bg-card/90 text-primary gap-2.5 border-2 border-primary/20 font-semibold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <MessageCircle className="h-5 w-5 fill-primary" strokeWidth={0} />
            <span>WhatsApp</span>
          </Button>
        </div>
      </Card>
    </Link>
  );
}
