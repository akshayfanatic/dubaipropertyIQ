import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { ImageObject } from '@/types/images';

interface PropertyItemGalleryProps {
  photos: ImageObject[];
  title: string;
  goldenVisaEligible: boolean;
}

export function PropertyItemGallery({ photos, title, goldenVisaEligible }: PropertyItemGalleryProps) {
  const firstImage = photos.find((img) => img.url)?.url || null;

  return (
    <div className="sm:w-72 sm:shrink-0 aspect-4/3 sm:aspect-auto relative overflow-hidden bg-muted">
      <ImageWithFallback src={firstImage} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" fallbackClassName="bg-muted" />
      {goldenVisaEligible && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">Golden Visa</Badge>
        </div>
      )}
    </div>
  );
}
