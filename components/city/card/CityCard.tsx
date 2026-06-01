import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { City } from '@/types/city';

interface CityCardProps {
  city: City;
  imageUrl: string;
  areaCount?: number;
}

export function CityCard({ city, imageUrl, areaCount = 0 }: CityCardProps) {
  const hasImage = imageUrl && imageUrl.trim() !== '';

  return (
    <Link href={`/areas/${city.slug}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Card className="card-entrance relative flex min-h-[280px] overflow-hidden rounded-2xl border border-border bg-card p-0 text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl">
        {hasImage ? (
          <div className="absolute inset-0 bg-muted">
            <ImageWithFallback src={imageUrl} alt={city.name} fill className="object-cover transition-transform duration-700 group-hover:scale-108" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/25 via-primary/10 to-muted" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.21_0.03_263.61_/_0)_28%,oklch(0.21_0.03_263.61_/_0.55)_60%,oklch(0.21_0.03_263.61_/_0.92)_100%)]" />
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />

        <div className="relative z-10 mt-auto w-full p-6">
          <h3 className="flex items-center justify-between gap-4 text-[1.3rem] font-extrabold leading-tight tracking-normal drop-shadow-sm">
            <span className="line-clamp-2 min-w-0">{city.name}</span>
            <ArrowRight className="size-5 shrink-0 translate-x-[-6px] text-primary-foreground/0 transition-all duration-300 group-hover:translate-x-0 group-hover:animate-float-x group-hover:text-primary-100" />
          </h3>

          <div className="mt-4 flex gap-5">
            <div>
              <b className="block text-[1.05rem] font-extrabold leading-5 text-primary-foreground tabular-nums">{areaCount}</b>
              <span className="text-xs text-primary-foreground/70">{areaCount === 1 ? 'area' : 'areas'}</span>
            </div>
            <div>
              <b className="block text-[1.05rem] font-extrabold leading-5 text-primary-100">Guide</b>
              <span className="text-xs text-primary-foreground/70">community data</span>
            </div>
            <div>
              <b className="block text-[1.05rem] font-extrabold leading-5 text-primary-foreground">Explore</b>
              <span className="text-xs text-primary-foreground/70">properties</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
