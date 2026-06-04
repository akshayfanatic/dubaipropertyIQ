import Link from 'next/link';
import { ArrowRight, Banknote, Building2, Home, MapPin, Percent, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { formatPrice } from '@/lib/utils/price';
import type { BuildingWithRelations } from '@/types/building';

interface BuildingCardProps {
  building: BuildingWithRelations;
}

// Public preview card that links an area page visitor into the full building report.
export function BuildingCard({ building }: BuildingCardProps) {
  const image = building.photos?.[0];
  const pricePerSqft = typeof building.avg_price_per_sqft === 'number' ? formatPrice(building.avg_price_per_sqft) : null;
  const rentalYield = typeof building.rental_yield === 'number' ? `${building.rental_yield}%` : null;
  const score = typeof building.overall_score === 'number' ? building.overall_score : null;
  const href = building.city?.slug && building.area?.slug ? `/areas/${building.city.slug}/${building.area.slug}/${building.slug}` : null;
  const locationLabel = building.address || building.area?.name || building.city?.name || 'UAE';
  const amenities = building.amenities ?? [];

  return (
    <article className="group overflow-hidden rounded-[22px] border border-border bg-card shadow-[0_18px_45px_oklch(0.2_0.03_263.61_/_0.10)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_oklch(0.2_0.03_263.61_/_0.15)]">
      <div className="relative aspect-[0.78] overflow-hidden bg-muted sm:aspect-[0.86]">
        <ImageWithFallback src={image?.url} alt={image?.alt_tag || building.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.18_0.025_263.61_/_0.86)] via-[oklch(0.18_0.025_263.61_/_0.24)] to-transparent transition-colors duration-300 group-hover:from-[oklch(0.16_0.03_263.61_/_0.92)]" />

        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {building.building_type && (
              <Badge className="rounded-full border-white/20 bg-white/90 px-3 py-1 text-[11px] font-extrabold text-foreground backdrop-blur-sm">{building.building_type}</Badge>
            )}
            {building.ownership_type && <Badge className="rounded-full border-white/20 bg-white/18 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur-sm">{building.ownership_type}</Badge>}
          </div>
          {score !== null && (
            <Badge className="gap-1.5 rounded-full border-white/20 bg-white/90 px-3 py-1 text-[11px] font-extrabold text-foreground shadow-sm backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {score}/100
            </Badge>
          )}
        </div>

        <div className="absolute inset-x-4 bottom-4">
          <div className="transition-[opacity,transform] duration-300 ease-out md:group-hover:-translate-y-2 md:group-hover:opacity-0 md:group-focus-within:-translate-y-2 md:group-focus-within:opacity-0">
            <h3 className="line-clamp-2 text-2xl font-extrabold leading-tight text-white drop-shadow-sm">{building.name}</h3>
            <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-white/82">
              <MapPin className="h-4 w-4 shrink-0 text-white/75" />
              <span className="truncate">{locationLabel}</span>
            </div>
          </div>

          <div className="mt-4 space-y-4 rounded-2xl border border-white/18 bg-white/92 p-4 text-foreground shadow-[0_18px_44px_oklch(0.2_0.03_263.61_/_0.18)] backdrop-blur-md transition-[opacity,transform] duration-300 ease-out md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:pointer-events-none md:translate-y-5 md:scale-[0.98] md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:scale-100 md:group-focus-within:opacity-100">
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-muted/45">
              <div className="min-w-0 border-r border-border p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-muted-foreground">
                  <Banknote className="h-3.5 w-3.5" />
                  Price
                </div>
                <p className="truncate text-sm font-extrabold text-foreground">{pricePerSqft ?? 'N/A'}</p>
              </div>
              <div className="min-w-0 border-r border-border p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-muted-foreground">
                  <Percent className="h-3.5 w-3.5" />
                  Yield
                </div>
                <p className="truncate text-sm font-extrabold text-foreground">{rentalYield ?? 'N/A'}</p>
              </div>
              <div className="min-w-0 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-muted-foreground">
                  <Home className="h-3.5 w-3.5" />
                  Units
                </div>
                <p className="truncate text-sm font-extrabold text-foreground">{building.total_units ? building.total_units : 'N/A'}</p>
              </div>
            </div>

            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {amenities.slice(0, 4).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] font-bold">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 4 && (
                  <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] font-bold">
                    +{amenities.length - 4}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="truncate">Building report available</span>
              </div>
              {href && (
                <Link
                  href={href}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35"
                >
                  View
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
