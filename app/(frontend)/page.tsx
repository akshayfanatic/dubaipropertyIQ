import HeroBanner from '@/components/home/HeroBanner';
import HomeSearchForm from '@/components/home/HomeSearchForm';
import { CityPropertyTabs } from '@/components/properties/CityPropertyTabs';
import { SectionCard } from '@/components/shared/SectionCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCities } from '@/lib/db/cities/queries';
import { Card } from '@/components/ui/card';

export default async function Home() {
  const citiesResult = await getCities({ limit: 5 });
  const cities = citiesResult.success ? (citiesResult.data?.data ?? []) : [];

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

      <Card>
        <SectionCard
          title="Explore Properties by City"
          description="Discover the latest off-plan properties and be informed."
          className="container mx-auto"
          actions={
            <Button variant="outline" size="lg" asChild className="text-primary font-bold ">
              <Link href="/properties">View All Properties</Link>
            </Button>
          }
        >
          <CityPropertyTabs cities={cities} />
        </SectionCard>
      </Card>
    </>
  );
}
