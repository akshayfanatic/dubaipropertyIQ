import HeroBanner from '@/components/home/HeroBanner';
import HomeSearchForm from '@/components/home/HomeSearchForm';
import { CityPropertyTabs } from '@/components/properties/CityPropertyTabs';
import { SectionCard } from '@/components/shared/SectionCard';
import { DeveloperCard } from '@/components/developers/card/DeveloperCard';
import { SliderSection } from '@/components/sliders/SliderSection';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getCities } from '@/lib/db/cities/queries';
import { getDevelopers } from '@/lib/db/developers/queries';
import { cn, delay } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default async function Home() {
  await delay();
  const citiesResult = await getCities({ limit: 5 });
  const cities = citiesResult.success ? (citiesResult.data?.data ?? []) : [];

  const developersResult = await getDevelopers();
  const developers = developersResult.success ? (developersResult.data ?? []) : [];

  return (
    <>
      <HeroBanner
        badge="Premium Properties"
        headline="Find Your Dream Home"
        subtext="Discover exceptional properties in Dubai's most prestigious locations. Your perfect home awaits with our curated collection."
        backgroundImage="/assets/images/hero-bg.jpg"
      >
        <HomeSearchForm />
      </HeroBanner>

      <Card className="border-none">
        <SectionCard title="Explore Properties by City" description="Discover the latest off-plan properties and be informed." className="container mx-auto">
          <div className="space-y-4 flex items-center flex-col">
            <CityPropertyTabs cities={cities} />
            <Link href="/properties" className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'text-secondary font-semibold')}>
              View All Properties
            </Link>
          </div>
        </SectionCard>
      </Card>

      <Card className="py-12 md:py-16">
        <SliderSection
          title="Project By Developers in the UAE"
          className="container mx-auto border-none! shadow-none!"
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
      </Card>
    </>
  );
}
