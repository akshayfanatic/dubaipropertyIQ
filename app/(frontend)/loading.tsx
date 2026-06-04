import { Skeleton } from '@/components/ui/skeleton';
import { DeveloperCardSkeleton } from '@/components/developers/card/DeveloperCard';
import { PropertyCardSkeleton } from '@/components/properties/card';
import { PageBanner } from '@/components/shared/PageBanner';
import { HomeBannerSkeleton } from '@/components/home/HomeBanner';
import { HomeHeroStats } from '@/components/home/HomeHeroStats';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
  return (
    <>
      <PageBanner
        className="flex-col"
        heightClassName="min-h-0 pt-[100px] pb-12 md:min-h-screen md:pt-[104px] md:pb-[132px]"
        bottomContentClassName="hidden md:absolute md:block md:mt-0"
        bottomContent={<HomeHeroStats />}
      >
        <HomeBannerSkeleton />
      </PageBanner>

      <Separator />

      {/* Explore Properties by City Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="container mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="space-y-6">
            {/* City tabs skeleton */}
            <div className="w-full flex gap-2 justify-center overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className={`h-10 rounded-full ${i === 0 ? 'w-24' : 'w-20'}`} />
              ))}
            </div>
            {/* Tab content skeleton - property cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Developers Slider Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="container mx-auto space-y-6">
          {/* Section title & description */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          {/* Developer cards */}
          <DeveloperCardSkeleton count={4} />
        </div>
      </div>
    </>
  );
}
