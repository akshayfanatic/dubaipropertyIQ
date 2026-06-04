import Image from 'next/image';
import { cn } from '@/lib/utils';

export type AmenityPillItem = {
  id: string;
  name: string;
  logo_url?: {
    url?: string | null;
    alt_tag?: string | null;
  } | null;
};

type AmenityPillsProps = {
  amenities: AmenityPillItem[];
  compact?: boolean;
};

function AmenityLogo({ amenity, compact }: { amenity: AmenityPillItem; compact?: boolean }) {
  if (!amenity.logo_url?.url) {
    return null;
  }

  return (
    <span className={cn('icon-wiggle-subtle motion-reduce:animate-none flex shrink-0 items-center justify-center rounded-full bg-white/90', compact ? 'h-5 w-5' : 'h-6 w-6')}>
      <Image src={amenity.logo_url.url} alt={amenity.logo_url.alt_tag || amenity.name} width={16} height={16} unoptimized className={cn('object-contain', compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
    </span>
  );
}

// Horizontal amenity pill rail for hero/banner contexts.
export function AmenityPills({ amenities, compact }: AmenityPillsProps) {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex max-w-full overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', compact ? 'gap-2' : 'gap-3')}>
      {amenities.map((amenity) => (
        <div
          key={amenity.id}
          className={cn(
            'card-entrance motion-reduce:animate-none flex shrink-0 items-center border border-white/35 bg-white/10 font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors hover:bg-white/15',
            compact ? 'h-9 gap-2 rounded-xl px-3 text-xs' : 'h-12 gap-2.5 rounded-2xl px-4 text-sm',
          )}
        >
          <AmenityLogo amenity={amenity} compact={compact} />
          <span className="whitespace-nowrap">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
}
