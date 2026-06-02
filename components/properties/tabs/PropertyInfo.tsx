import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils/price';
import type { Property } from '@/types/property';

interface PropertyInfoProps {
  property: Property & {
    category?: { name: string };
    city?: { name: string };
    developer?: { name: string };
  };
  children?: React.ReactNode;
  id?: string;
}

export function PropertyInfo({ property, children, id }: PropertyInfoProps) {
  const cityName = property.city?.name || 'Dubai';
  const developerName = property.developer?.name;

  return (
    <Card id={id} className="rounded-[18px] border border-border bg-card shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.10)]">
      <CardContent className="p-[clamp(1.25rem,3vw,2rem)]">
        {/* Title & Price */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="max-w-3xl text-[clamp(1.9rem,3.4vw,3rem)] font-extrabold leading-[1.08] tracking-normal text-foreground">{property.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-muted-foreground md:text-base">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {cityName}
              </span>
              {developerName && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  {developerName}
                </span>
              )}
              {property.category?.name && <span>{property.category.name}</span>}
            </div>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="text-[clamp(1.6rem,3vw,2.4rem)] font-black leading-none text-primary">{formatPrice(property.price_aed)}</p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">Starting from</p>
          </div>
        </div>

        {/* Composition: Render children (like PropertyDescription) */}
        {children && <div className="mb-6 max-w-[78ch]">{children}</div>}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="border-t border-border pt-5">
            <h2 className="mb-4 text-lg font-extrabold text-foreground md:text-xl">Features & Amenities</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm font-bold text-primary-800">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.6} />
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
