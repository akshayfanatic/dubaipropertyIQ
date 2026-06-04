import { BarChart3, Building2, MapPin, Percent, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { BuildingWithRelations } from '@/types/building';

interface BuildingCardProps {
  building: BuildingWithRelations;
}

const formatNumber = (value?: number | null) => (typeof value === 'number' ? value.toLocaleString('en-AE') : null);

export function BuildingCard({ building }: BuildingCardProps) {
  const image = building.photos?.[0];
  const pricePerSqft = formatNumber(building.avg_price_per_sqft ? Number(building.avg_price_per_sqft) : null);
  const rentalYield = typeof building.rental_yield === 'number' ? `${building.rental_yield}%` : null;
  const score = typeof building.overall_score === 'number' ? building.overall_score : null;

  return (
    <article className="group overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_14px_34px_oklch(0.2_0.03_263.61/0.10)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_42px_oklch(0.2_0.03_263.61_/_0.14)]">
      <div className="relative h-56 overflow-hidden bg-muted">
        <ImageWithFallback src={image?.url} alt={image?.alt_tag || building.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
        {score !== null && (
          <Badge className="absolute left-3 top-3 gap-1.5 rounded-md bg-background/95 px-2.5 py-1 text-foreground shadow-sm">
            <Star className="h-3.5 w-3.5 text-primary" />
            {score}/100
          </Badge>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {building.building_type && <Badge variant="outline">{building.building_type}</Badge>}
            {building.ownership_type && <Badge variant="outline">{building.ownership_type}</Badge>}
          </div>
          <h3 className="text-xl font-extrabold leading-tight text-foreground">{building.name}</h3>
          <div className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{building.address || building.area?.name || building.city?.name || 'UAE'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {pricePerSqft && (
            <div className="rounded-lg border border-border bg-muted/35 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5" />
                Avg / sqft
              </div>
              <p className="text-sm font-extrabold text-foreground">AED {pricePerSqft}</p>
            </div>
          )}
          {rentalYield && (
            <div className="rounded-lg border border-border bg-muted/35 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
                <Percent className="h-3.5 w-3.5" />
                Yield
              </div>
              <p className="text-sm font-extrabold text-foreground">{rentalYield}</p>
            </div>
          )}
        </div>

        {building.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {building.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="rounded-md">
                {amenity}
              </Badge>
            ))}
            {building.amenities.length > 4 && (
              <Badge variant="secondary" className="rounded-md">
                +{building.amenities.length - 4}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary" />
          <span>{building.total_units ? `${building.total_units} units` : 'Building intelligence'}</span>
        </div>
      </div>
    </article>
  );
}
