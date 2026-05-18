import { ReactNode } from 'react';
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
    <div className="relative z-10 flex min-h-150 flex-col items-center justify-center bg-white px-4 py-16 text-center lg:px-8">
      {/* Badge */}
      {badge && (
        <span className="animation-ease-out mb-4 inline-block animate-in slide-in-from-top-4 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 fade-in animation-duration-700">
          {badge}
        </span>
      )}

      {/* Headline */}
      <h1 className="animation-ease-out fill-mode-both mb-4 animate-in slide-in-from-bottom-8 text-4xl font-bold tracking-tight text-black fade-in animation-duration-1000 delay-200 md:text-5xl lg:text-6xl">
        <Typewriter speed={200} loop text={headline} />
      </h1>

      {/* Subtext */}
      <p className="animation-ease-out fill-mode-both mb-8 max-w-2xl animate-in slide-in-from-bottom-6 text-base text-gray-500 fade-in animation-duration-1000 delay-300 md:text-lg">{subtext}</p>

      {/* Search Form Slot */}
      {searchForm && <div className="animation-ease-out fill-mode-both w-full animate-in slide-in-from-bottom-4 fade-in animation-duration-1000 delay-500">{searchForm}</div>}
    </div>
  );
}

export function HomeBannerSkeleton() {
  return (
    <div className="relative z-10 flex min-h-150 flex-col items-center justify-center bg-white px-4 py-16 text-center lg:px-8">
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
