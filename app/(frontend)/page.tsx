import HomeSearchForm from '@/components/home/HomeSearchForm';
import { CityPropertyTabs } from '@/components/properties/CityPropertyTabs';
import { SectionCard } from '@/components/shared/SectionCard';
import { DeveloperCard } from '@/components/developers/card/DeveloperCard';
import { SliderSection } from '@/components/sliders/SliderSection';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getCities, getFeaturedCitiesAreas } from '@/lib/db/cities/queries';
import { getDevelopers } from '@/lib/db/developers/queries';
import { getPublishedBlogs } from '@/lib/db/blogs/queries';
import { cn } from '@/lib/utils';
import { ToolsSection } from '@/components/home/ToolsSection';
import { FeaturedCities } from '@/components/home/FeaturedCities';
import { BlogGuidesSection } from '@/components/home/BlogGuidesSection';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { PageBanner } from '@/components/shared/PageBanner';
import HomeBanner from '@/components/home/HomeBanner';
import { ArrowRight } from 'lucide-react';

async function getHomeData() {
  const [citiesResult, featuredCitiesResult, developersResult, blogsResult] = await Promise.all([getCities({ limit: 5 }), getFeaturedCitiesAreas(), getDevelopers(), getPublishedBlogs()]);

  return {
    cities: citiesResult.success ? (citiesResult.data?.data ?? []) : [],
    featuredCities: featuredCitiesResult.success ? (featuredCitiesResult.data ?? []) : [],
    developers: developersResult.success ? (developersResult.data ?? []) : [],
    blogs: blogsResult.success ? (blogsResult.data ?? []).slice(0, 3) : [],
  };
}

export default async function Home() {
  const { cities, featuredCities, developers, blogs } = await getHomeData();

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
          searchForm={<HomeSearchForm />}
        />
      </PageBanner>

      <AnimateSection>
        <SectionCard eyebrow="Hand-picked" title="Explore Properties by City" description="Discover the latest off-plan properties and be informed." className="bg-muted/45">
          <div className="flex flex-col gap-8">
            <CityPropertyTabs cities={cities} propertiesPerCity={4} isFeatured />
            <div className="flex justify-center">
              <Link href="/search" className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'text-secondary font-semibold')}>
                View All Properties
              </Link>
            </div>
          </div>
        </SectionCard>
      </AnimateSection>

      <AnimateSection>
        <SectionCard
          eyebrow="Explore by community"
          title="Featured Investment Areas"
          description="Explore top investment locations across the UAE with market insights and rental yields"
          className="bg-background"
          align="center"
        >
          <FeaturedCities cities={featuredCities} />
        </SectionCard>
      </AnimateSection>

      <AnimateSection>
        <SliderSection
          title="Explore Developers Projects"
          className="bg-muted/45"
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

      <AnimateSection>
        <SectionCard
          eyebrow="Free investor tools"
          title="Property Investment Tools"
          description="Make informed decisions with our suite of Dubai-specific calculators and comparison tools"
          className="bg-background"
        >
          <ToolsSection />
        </SectionCard>
      </AnimateSection>

      {blogs.length > 0 && (
        <AnimateSection>
          <SectionCard
            eyebrow="Market insights"
            title="Guides for smarter investors"
            className="bg-muted/45"
            navigation={
              <Link
                href="/blogs"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2 rounded-full bg-background font-bold text-primary hover:bg-primary hover:text-primary-foreground')}
              >
                All guides
                <ArrowRight className="size-4" />
              </Link>
            }
          >
            <BlogGuidesSection blogs={blogs} limit={3} />
          </SectionCard>
        </AnimateSection>
      )}
    </>
  );
}
