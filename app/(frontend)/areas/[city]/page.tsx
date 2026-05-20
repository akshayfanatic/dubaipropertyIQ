import { notFound } from 'next/navigation';
import { AreaCard } from '@/components/areas/card/AreaCard';
import { CitySelectField } from '@/components/city/CitySelectField';
import PageLayout from '@/components/layout/PageLayout';
import { PropertyCardHomeSlide } from '@/components/properties/card';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { getAreasByCity } from '@/lib/db/areas/queries';
import { getCityBySlug, getCityOptions } from '@/lib/db/cities/queries';
import { getPropertiesByCity } from '@/lib/db/properties/queries';
import { SliderSection } from '@/components/sliders/SliderSection';
import type { ImageObject } from '@/types/images';

type AreaPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export default async function AreaPage({ params }: AreaPageProps) {
  const { city } = await params;
  const [cities, cityInformation] = await Promise.all([getCityOptions(), getCityBySlug(city)]);

  if (!cityInformation.success || !cityInformation.data) {
    notFound();
  }

  const cityOptions = cities.data?.map((cityOption) => ({ label: cityOption.label, value: cityOption.slug })) ?? [];
  const cityImage = cityInformation.data.logo_url as ImageObject | string | null | undefined;
  const cityImageUrl = typeof cityImage === 'string' ? cityImage : cityImage?.url;
  const cityImageAlt = typeof cityImage === 'string' ? `${cityInformation.data.name} area skyline` : cityImage?.alt_tag || `${cityInformation.data.name} area skyline`;

  return (
    <PageLayout contentFullWidth>
      <PageBanner
        imageUrl={cityImageUrl}
        alt={cityImageAlt}
        heightClassName="min-h-[320px] sm:min-h-[560px]"
        overlayClassName="bg-black/45"
        contentClassName="container mx-auto flex min-h-[320px] flex-col px-4 py-5 sm:min-h-[560px] sm:px-6 sm:py-8 lg:px-8"
      >
        <div className="[&_a]:text-white/80 [&_a:hover]:text-white [&_button]:text-white/80 [&_button:hover]:text-white **:data-[slot=breadcrumb-page]:text-white">
          <PublicBreadCrumb />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="inline-flex rounded-full border border-white/25 bg-white/20 p-1 shadow-[0_22px_60px_rgba(15,23,42,0.24)] backdrop-blur-xl ring-1 ring-white/15">
            <CitySelectField options={cityOptions} value={city} />
          </div>
        </div>
      </PageBanner>

      <SectionCard
        title="Explore all Areas"
        description="Explore communities and neighborhoods in this city."
        classes={{ title: 'text-3xl font-bold text-foreground', description: 'text-muted-foreground' }}
      >
        <AreasItems city={city} />
      </SectionCard>

      <PropertiesItems city={city} />
    </PageLayout>
  );
}

async function AreasItems({ city }: { city: string }) {
  const { success, data: areas, message } = await getAreasByCity(city);
  const hasAreas = Boolean(areas?.length);

  if (!success) {
    return <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{message || 'Failed to fetch areas'}</div>;
  }

  if (!hasAreas) {
    return <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">No areas found for this city.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {areas?.map((area) => (
        <AreaCard key={area.slug} name={area.name} photos={area.photos} />
      ))}
    </div>
  );
}

async function PropertiesItems({ city }: { city: string }) {
  const { success, data: properties, message } = await getPropertiesByCity(city);
  const hasProperties = Boolean(properties?.length);

  if (!success) {
    return <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{message || 'Failed to fetch properties'}</div>;
  }

  if (!hasProperties) return null;

  return (
    <SliderSection
      title="Properties"
      description="Browse available properties in this city."
      data={properties ?? []}
      SlideComponent={PropertyCardHomeSlide}
      delay={4000}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      }}
      classes={{
        title: 'font-bold',
      }}
    />
  );
}
