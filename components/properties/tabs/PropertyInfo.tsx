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
    <Card id={id} className="border border-border/50 shadow-2xl rounded-2xl bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
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
          <div className="sm:text-right text-left">
            <p className="text-2xl md:text-3xl font-bold text-primary">{formatPrice(property.price_aed)}</p>
            <p className="text-sm text-muted-foreground">Starting from</p>
          </div>
        </div>

        {/* Composition: Render children (like PropertyDescription) */}
        {children && <div className="mb-6">{children}</div>}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="pt-4">
            <h2 className="text-lg md:text-xl font-semibold mb-3">Features & Amenities</h2>
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
  );
}
