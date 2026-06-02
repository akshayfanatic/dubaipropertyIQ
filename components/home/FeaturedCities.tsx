import type { CityWithAreaCount } from '@/types/city';
import type { ImageObject } from '@/types/images';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { CityCard } from '@/components/city/card/CityCard';

interface FeaturedCitiesProps {
  cities: CityWithAreaCount[];
}

function getCityImageUrl(city: CityWithAreaCount): string {
  const logoUrl = city.logo_url as ImageObject | null;
  return logoUrl?.url ?? '';
}

export function FeaturedCities({ cities }: FeaturedCitiesProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cities.map((city, index) => (
        <AnimateSection key={city.id} delay={index * 100}>
          <CityCard city={city} imageUrl={getCityImageUrl(city)} areaCount={city.area_count} />
        </AnimateSection>
      ))}
    </div>
  );
}
