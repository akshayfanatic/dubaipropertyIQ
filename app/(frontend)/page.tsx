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
      <PageBanner>
        <HomeBanner headline="Find Your Dream Home" subtext="Discover exceptional properties in Dubai" searchForm={<HomeSearchForm />} />
      </PageBanner>

      <Separator />

      <AnimateSection>
        <SectionCard title="Explore Properties by City" description="Discover the latest off-plan properties and be informed." className="bg-white">
          <div className="space-y-4 flex items-center flex-col">
            <CityPropertyTabs cities={cities} />
            <Link href="/properties" className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'text-secondary font-semibold')}>
              View All Properties
            </Link>
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
          title="Project By Developers in the UAE"
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
