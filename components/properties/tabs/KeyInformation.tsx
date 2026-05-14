import { formatSize } from '@/lib/utils/price';
import { Property } from '@/types';
import { Bath, Bed, Maximize } from 'lucide-react';

const PropertyAttributes = ({ bathrooms = 0, bedrooms = 0, size_sqft = 0 }: Pick<Property, 'bathrooms' | 'bedrooms' | 'size_sqft'>) => {
  return (
    <div className="flex flex-wrap items-center gap-y-6 gap-x-8 sm:gap-x-12 py-4 px-2">
      {/* Bedrooms */}
      {bedrooms > 0 && (
        <div className="flex items-center gap-4 group">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Bed className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">{bedrooms}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Beds</span>
            </div>
            <span className="text-[10px] text-muted-foreground/60 font-medium">Total Bedrooms</span>
          </div>
        </div>
      )}

      {/* Separator */}
      <div className="hidden sm:block w-px h-10 bg-border/60" />

      {/* Bathrooms */}
      {bathrooms > 0 && (
        <div className="flex items-center gap-4 group">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Bath className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">{bathrooms}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Baths</span>
            </div>
            <span className="text-[10px] text-muted-foreground/60 font-medium">Full Bathrooms</span>
          </div>
        </div>
      )}

      {/* Separator */}
      <div className="hidden sm:block w-px h-10 bg-border/60" />

      {/* Size */}
      {size_sqft > 0 && (
        <div className="flex items-center gap-4 group">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Maximize className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">{formatSize(size_sqft)}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">sqft</span>
            </div>
            <span className="text-[10px] text-muted-foreground/60 font-medium">Living Area</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyAttributes;
