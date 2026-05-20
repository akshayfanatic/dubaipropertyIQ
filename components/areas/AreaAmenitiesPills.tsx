import Image from 'next/image';
import type { AreaAmenity } from '@/lib/db/areas/queries';

type AreaAmenitiesPillsProps = {
  amenities: Pick<AreaAmenity, 'id' | 'name' | 'logo_url'>[];
};

function AmenityLogo({ amenity }: { amenity: Pick<AreaAmenity, 'name' | 'logo_url'> }) {
  if (!amenity.logo_url?.url) {
    return null;
  }

  return (
    <span className="icon-wiggle-subtle motion-reduce:animate-none flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/90">
      <Image src={amenity.logo_url.url} alt={amenity.logo_url.alt_tag || amenity.name} width={16} height={16} unoptimized className="h-4 w-4 object-contain" />
    </span>
  );
}

export function AreaAmenitiesPills({ amenities }: AreaAmenitiesPillsProps) {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className="flex max-w-full gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {amenities.map((amenity) => (
        <div
          key={amenity.id}
          className="card-entrance  motion-reduce:animate-none flex h-12 shrink-0 items-center gap-2.5 rounded-2xl border border-white/35 bg-white/10 px-4 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors hover:bg-white/15"
        >
          <AmenityLogo amenity={amenity} />
          <span className="whitespace-nowrap">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
}
