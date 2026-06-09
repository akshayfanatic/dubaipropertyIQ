import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AreaCard } from '@/components/areas/card/AreaCard';
import { CitySelectField } from '@/components/city/CitySelectField';
import PageLayout from '@/components/layout/PageLayout';
import { PropertyCardSlide } from '@/components/properties/card';
import { PageBanner } from '@/components/shared/PageBanner';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { getAreasByCity } from '@/lib/db/areas/queries';
import { getCityBySlug, getCityOptions } from '@/lib/db/cities/queries';
import { getPropertiesByCity } from '@/lib/db/properties/queries';
import { SliderSection } from '@/components/sliders/SliderSection';
import type { ImageObject } from '@/types/images';
import { AnimateSection } from '@/components/shared/AnimateSection';

type AreaPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { city } = await params;
  const response = await getCityBySlug(city);

  if (!response.success || !response.data) {
    return {
      title: 'City Not Found',
    };
  }

  const cityInformation = response.data;
  const seo = cityInformation.cities_seo;
  const cityImage = cityInformation.logo_url as ImageObject | string | null | undefined;
  const cityImageUrl = seo?.og_image_url || (typeof cityImage === 'string' ? cityImage : cityImage?.url);
  const title = seo?.meta_title || `${cityInformation.name} Areas & Communities`;
  const description = seo?.meta_description || cityInformation.description || `Explore communities, areas, and available properties in ${cityInformation.name}.`;
  const canonical = seo?.canonical_url || `/areas/${cityInformation.slug}`;
  const keywords = seo?.keywords
    ?.split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: cityImageUrl ? [{ url: cityImageUrl }] : undefined,
      type: 'website',
    },
    twitter: {
      card: cityImageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: cityImageUrl ? [cityImageUrl] : undefined,
    },
  };
}

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
  const cityDescription = cityInformation.data.description || `Explore communities and neighborhoods in ${cityInformation.data.name}.`;

  return (
    <PageLayout wrapperClassName="py-0" contentFullWidth>
      {/* ── Hero Banner Section ── */}
      <PageBanner
        imageUrl={cityImageUrl}
        alt={cityImageAlt}
        heightClassName="min-h-[520px] sm:min-h-[620px]"
        overlayClassName="bg-[linear-gradient(180deg,oklch(0.18_0.05_260.47_/_0.42)_0%,oklch(0.18_0.05_260.47_/_0.42)_34%,oklch(0.18_0.05_260.47_/_0.86)_100%),radial-gradient(70%_54%_at_50%_10%,oklch(0.55_0.20_260.47_/_0.26),transparent_62%)]"
        contentClassName="container mx-auto flex min-h-[520px] flex-col px-4 py-5 sm:min-h-[620px] sm:px-6 sm:py-8 lg:px-8"
        className="bg-[oklch(0.2_0.12_260.47)]"
      >
        <div className="[&_a]:text-primary-foreground/75 [&_a:hover]:text-primary-foreground [&_button]:text-primary-foreground/75 [&_button:hover]:text-primary-foreground **:data-[slot=breadcrumb-page]:text-primary-foreground">
          <PublicBreadCrumb />
        </div>

        <div className="flex flex-1 items-center justify-center py-10 text-center">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
            <h1 className="text-4xl font-extrabold leading-[1.06] tracking-normal text-primary-foreground drop-shadow-[0_4px_34px_oklch(0.18_0.05_260.47_/_0.44)] sm:text-5xl lg:text-7xl">
              {cityInformation.data.name} Areas
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-primary-foreground/85 sm:text-lg">{cityDescription}</p>
            <div className="mt-6">
              <CitySelectField options={cityOptions} value={city} />
            </div>
          </div>
        </div>
      </PageBanner>

      <AreasSection city={city} cityName={cityInformation.data.name} />

      <PropertiesSection city={city} />
    </PageLayout>
  );
}

async function AreasSection({ city, cityName }: { city: string; cityName: string }) {
  const { success, data: areas, message } = await getAreasByCity(city);

  if (!success) {
    return (
      <AnimateSection>
        <SectionCard>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{message || 'Failed to fetch areas'}</div>
        </SectionCard>
      </AnimateSection>
    );
  }

  if (!areas?.length) return null;

  return (
    /* ── Areas Grid Section ── */
    <AnimateSection>
      <SectionCard
        eyebrow="Explore by community"
        title={`Areas in ${cityName}.`}
        className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
        classes={{
          wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
          eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
          title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
        }}
      >
        <div className="grid grid-cols-1 gap-[1.15rem] sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <AreaCard key={area.slug} name={area.name} photos={area.photos} slug={area.slug} citySlug={city} />
          ))}
        </div>
      </SectionCard>
    </AnimateSection>
  );
}

async function PropertiesSection({ city }: { city: string }) {
  const { success, data: properties, message } = await getPropertiesByCity(city);

  if (!success) {
    return (
      <AnimateSection>
        <SectionCard>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{message || 'Failed to fetch properties'}</div>
        </SectionCard>
      </AnimateSection>
    );
  }

  if (!properties?.length) return null;

  return (
    /* ── Properties Section ── */
    <AnimateSection>
      <SliderSection
        eyebrow="Available properties"
        title="Properties"
        description="Browse available properties in this city."
        data={properties}
        SlideComponent={PropertyCardSlide}
        delay={4000}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
        classes={{
          wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
          eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
          title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold leading-tight',
          description: 'max-w-[470px] font-medium',
        }}
      />
    </AnimateSection>
  );
}
