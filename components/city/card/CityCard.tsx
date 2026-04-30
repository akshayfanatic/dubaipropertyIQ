import Link from 'next/link';
import { MapPin, Building2 } from 'lucide-react';
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
    <Link href={`/areas/${city.slug}`} className="group block">
      <Card className="relative overflow-hidden rounded-xl aspect-4/3 border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Background Image */}
        {hasImage ? (
          <div className="absolute inset-0 bg-muted">
            <ImageWithFallback src={imageUrl} alt={city.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
          {/* City Name */}
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-lg font-bold">{city.name}</span>
          </div>

          {/* Area Count */}
          <div className="flex items-center gap-1.5 text-sm text-primary-foreground/80">
            <Building2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>{areaCount} Areas</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
