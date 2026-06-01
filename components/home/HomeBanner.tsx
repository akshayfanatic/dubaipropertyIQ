import { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Typewriter } from '../shared/Typewriter';
import { HomeSearchFormSkeleton } from './HomeSearchForm';

interface HomeBannerProps {
  badge?: string;
  headline: string;
  subtext: string;
  searchForm?: ReactNode;
}

export default function HomeBanner({ badge, headline, subtext, searchForm }: HomeBannerProps) {
  return (
    <div className="relative z-10 flex min-h-[560px] flex-col items-center justify-center py-12 text-center md:min-h-[600px]">
      {/* Badge */}
      {badge && (
        <span className="animation-ease-out mb-5 inline-flex w-fit items-center gap-2 self-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-4 animation-duration-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          {badge}
        </span>
      )}

      {/* Headline */}
      <h1 className="animation-ease-out fill-mode-both mx-auto mb-5 max-w-4xl animate-in slide-in-from-bottom-8 text-4xl font-bold leading-[1.05] tracking-tight text-white fade-in drop-shadow-sm animation-duration-1000 delay-200 md:text-5xl lg:text-6xl">
        {headline}
      </h1>

      {/* Subtext */}
      <p className="animation-ease-out fill-mode-both mx-auto mb-6 max-w-2xl animate-in slide-in-from-bottom-6 text-base leading-7 text-white/86 fade-in drop-shadow-sm animation-duration-1000 delay-300 md:text-lg">
        {subtext}
      </p>

      {/* Search Form Slot */}
      {searchForm && <div className="animation-ease-out fill-mode-both mx-auto w-full animate-in slide-in-from-bottom-4 fade-in animation-duration-1000 delay-500">{searchForm}</div>}
    </div>
  );
}

export function HomeBannerSkeleton() {
  return (
    <div className="relative z-10 flex min-h-150 flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
      {/* Headline Skeleton */}
      <div className="mb-4 flex h-10 w-full max-w-xl animate-pulse justify-center md:h-12 lg:h-16">
        <div className="h-full w-full rounded-md bg-gray-200" />
      </div>

      {/* Subtext Skeleton */}
      <div className="mb-8 flex h-5 w-full max-w-2xl animate-pulse justify-center md:h-6">
        <div className="h-full w-3/4 rounded-md bg-gray-200" />
      </div>

      {/* Search Form Slot Skeleton */}
      <HomeSearchFormSkeleton />
    </div>
  );
}
