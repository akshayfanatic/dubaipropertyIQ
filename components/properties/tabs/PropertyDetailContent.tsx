'use client';

import { Bed, Bath, Maximize, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { formatPrice, formatSize } from '@/lib/utils/price';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import type { PropertyListItem } from '@/types/property';
import type { ImageObject } from '@/types/images';
import { cn } from '@/lib/utils';

interface PropertyDetailContentProps {
  property: PropertyListItem;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-primary/95 text-primary-foreground backdrop-blur-sm' },
  sold: { label: 'Sold', className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm' },
  reserved: { label: 'Reserved', className: 'bg-accent/90 text-accent-foreground backdrop-blur-sm' },
  off_plan: { label: 'Off Plan', className: 'bg-secondary/90 text-secondary-foreground backdrop-blur-sm' },
};

export function PropertyDetailContent({ property }: PropertyDetailContentProps) {
  const photos = property.photos as ImageObject[];
  const firstImage = photos?.[0]?.url || '/assets/images/placeholder.jpg';
  const status = statusConfig[property.status] || { label: property.status, className: 'bg-muted/90 text-muted-foreground backdrop-blur-sm' };

  const categoryName = property.category?.[0]?.name || 'Property';
  const cityName = property.city?.[0]?.name || 'Dubai';
  const developerName = property.developer?.[0]?.name;

  return (
    <div className="min-h-screen">
      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] bg-muted">
        <ImageWithFallback src={firstImage} alt={property.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-6 left-6">
          <Badge className={cn('px-4 py-2 text-sm font-semibold rounded-lg shadow-lg', status.className)}>{status.label}</Badge>
        </div>

        {/* Golden Visa Badge */}
        {property.golden_visa_eligible && (
          <div className="absolute top-6 right-6">
            <Badge className="px-4 py-2 text-sm font-semibold rounded-lg shadow-lg bg-amber-500/95 text-white backdrop-blur-sm">Golden Visa Eligible</Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{cityName}</span>
                      {developerName && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {developerName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{formatPrice(property.price_aed)}</p>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="flex flex-wrap gap-6 py-4 border-y">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{property.bedrooms}</span>
                      <span className="text-muted-foreground text-sm">Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{property.bathrooms}</span>
                      <span className="text-muted-foreground text-sm">Bathrooms</span>
                    </div>
                  )}
                  {property.size_sqft > 0 && (
                    <div className="flex items-center gap-2">
                      <Maximize className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{formatSize(property.size_sqft)}</span>
                      <span className="text-muted-foreground text-sm">sqft</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{categoryName}</Badge>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="pt-4">
                    <h2 className="text-xl font-semibold mb-3">Features & Amenities</h2>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Inquiry Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Interested in this property?</h3>
                <p className="text-sm text-muted-foreground">Contact us via WhatsApp for more information, schedule a viewing, or get details about similar properties.</p>

                <PropertyWhatsAppButton property={property} variant="card" className="h-12 w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold border-0" />

                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Reference:</strong> {property.slug}
                  </p>
                  <p>
                    <strong>Type:</strong> {categoryName}
                  </p>
                  {property.golden_visa_eligible && (
                    <p className="flex items-center gap-2 text-amber-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Golden Visa Eligible
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
