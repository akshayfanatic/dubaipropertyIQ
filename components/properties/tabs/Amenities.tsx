import { Property } from '@/types';
import { Check } from 'lucide-react';

type Props = Pick<Property, 'amenities'>;

const PropertyAmenities = ({ amenities = [] }: Props) => {
  if (!amenities.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6 py-2">
      {amenities.map((amenity, index) => (
        <div key={index} className="flex items-center gap-2.5 group">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-3 w-3 stroke-3" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PropertyAmenities;
