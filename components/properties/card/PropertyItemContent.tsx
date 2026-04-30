import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils/price';

interface PropertyItemContentProps {
  title: string;
  priceAed: number;
  description: string;
  cityName: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
}

export function PropertyItemContent({ title, priceAed, description, cityName, bedrooms, bathrooms, sizeSqft }: PropertyItemContentProps) {
  return (
    <div className="flex-1 flex flex-col p-6 mt-4">
      <CardHeader className="p-0 gap-2 mb-4">
        <div className="flex items-start justify-evenly gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-primary mb-1">{formatPrice(priceAed)}</CardTitle>
            <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
          </div>
          <CardDescription className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{cityName}</span>
          </CardDescription>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <div className="flex justify-start gap-5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bed className="h-4 w-4" />
          <span className="font-medium">{bedrooms}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bath className="h-4 w-4" />
          <span className="font-medium">{bathrooms}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Maximize className="h-4 w-4" />
          <span className="font-medium">{sizeSqft.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
