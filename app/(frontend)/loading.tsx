import HeroBanner from '@/components/home/HeroBanner';
import HomeSearchForm from '@/components/home/HomeSearchForm';
import { SectionCard } from '@/components/shared/SectionCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeveloperCardSkeleton } from '@/components/developers/card/DeveloperCard';
import { PropertyCardHomeSkeleton } from '@/components/properties/card/PropertyCard';

export default function Loading() {
  return (
    <>
      {/* Hero Section */}
      <HeroBanner
        badge="Premium Properties"
        headline="Find Your Dream Home"
        subtext="Discover exceptional properties in Dubai's most prestigious locations. Your perfect home awaits with our curated collection."
        backgroundImage="/assets/images/hero-bg.jpg"
      >
        <HomeSearchForm />
      </HeroBanner>

      {/* Explore Properties by City Section */}
      <Card className="border-none">
        <SectionCard title="Explore Properties by City" description="Discover the latest off-plan properties and be informed." className="container mx-auto">
          <div className="space-y-6">
            {/* City tabs skeleton */}
            <div className="w-full flex gap-2 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className={`h-10 rounded-full ${i === 0 ? 'w-24' : 'w-20'}`} />
              ))}
            </div>
            {/* Tab content skeleton - property cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <PropertyCardHomeSkeleton key={i} />
              ))}
            </div>
          </div>
        </SectionCard>
      </Card>

      {/* Developers Slider Section */}
      <Card className="py-12 md:py-16">
        <div className="container mx-auto space-y-6">
          {/* Section title & description */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          {/* Developer cards */}
          <DeveloperCardSkeleton count={4} />
        </div>
      </Card>
    </>
  );
}
