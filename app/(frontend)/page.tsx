import HomeSearchForm from '@/components/home/HomeSearchForm';
import { CityPropertyTabs } from '@/components/properties/CityPropertyTabs';
import { SectionCard } from '@/components/shared/SectionCard';
import { DeveloperCard } from '@/components/developers/card/DeveloperCard';
import { SliderSection } from '@/components/sliders/SliderSection';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getCities, getFeaturedCitiesAreas } from '@/lib/db/cities/queries';
import { getDevelopers } from '@/lib/db/developers/queries';
import { cn } from '@/lib/utils';
import { ToolsSection } from '@/components/home/ToolsSection';
import { FeaturedCities } from '@/components/home/FeaturedCities';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { Separator } from '@/components/ui/separator';
import { PageBanner } from '@/components/shared/PageBanner';
import HomeBanner from '@/components/home/HomeBanner';

async function getHomeData() {
  const [citiesResult, featuredCitiesResult, developersResult] = await Promise.all([getCities({ limit: 5 }), getFeaturedCitiesAreas(), getDevelopers()]);

  return {
    cities: citiesResult.success ? (citiesResult.data?.data ?? []) : [],
    featuredCities: featuredCitiesResult.success ? (featuredCitiesResult.data ?? []) : [],
    developers: developersResult.success ? (developersResult.data ?? []) : [],
  };
}

export default async function Home() {
  const { cities, featuredCities, developers } = await getHomeData();

  return (
    <>
      <PageBanner
        imageUrl="/assets/images/hero-bg-2.jpg"
        alt="Dubai skyline and property search hero"
        heightClassName="min-h-[640px] md:min-h-[680px]"
        overlayClassName="bg-[linear-gradient(90deg,oklch(0.18_0.04_260.47_/_0.86),oklch(0.21_0.03_263.61_/_0.58),oklch(0.21_0.03_263.61_/_0.22))]"
        contentClassName="container mx-auto px-4 md:px-6"
      >
        <HomeBanner
          badge="Dubai Property IQ"
          headline="Explore Your Home"
          subtext="Search Dubai communities, compare property types, and find the right investment path with cleaner market context."
          searchForm={
            <HomeSearchForm className="max-w-5xl rounded-2xl border-white/30 bg-background/78 shadow-2xl shadow-foreground/20 backdrop-blur-md **:data-[slot=select-trigger]:bg-card/92 [&_input]:bg-card/92" />
          }
        />
      </PageBanner>
      <Separator />

      <AnimateSection>
        <SectionCard title="Explore Properties by City" description="Discover the latest off-plan properties and be informed." className="bg-white">
          <div className="flex flex-col gap-8">
            <CityPropertyTabs cities={cities} propertiesPerCity={3} isFeatured />
            <div className="flex justify-center">
              <Link href="/search" className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'text-secondary font-semibold')}>
                View All Properties
              </Link>
            </div>
          </div>
        </SectionCard>
      </AnimateSection>

      <Separator />

      <AnimateSection>
        <SectionCard title="Featured Investment Areas" description="Explore top investment locations across the UAE with market insights and rental yields" className="bg-white">
          <FeaturedCities cities={featuredCities} />
        </SectionCard>
      </AnimateSection>

      <Separator />

      <AnimateSection>
        <SliderSection
          title="Explore Developers Projects"
          className="bg-white"
          data={developers}
          SlideComponent={DeveloperCard}
          delay={4000}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
        />
      </AnimateSection>

      <Separator />

      <AnimateSection>
        <SectionCard title="Property Investment Tools" description="Make informed decisions with our suite of Dubai-specific calculators and comparison tools" className="bg-white">
          <ToolsSection />
        </SectionCard>
      </AnimateSection>
    </>
  );
}
