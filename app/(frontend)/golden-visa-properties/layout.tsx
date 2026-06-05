import type { ReactNode } from 'react';
import { GoldenVisaConsultationContent } from '@/components/golden-visa-properties/GoldenVisaConsultationSection';
import { GoldenVisaEligibilityGuideContent } from '@/components/golden-visa-properties/GoldenVisaEligibilityGuide';
import { GoldenVisaHeroSection } from '@/components/golden-visa-properties/GoldenVisaHeroSection';
import PageLayout from '@/components/layout/PageLayout';
import SearchFilters from '@/components/search/SearchFilters';
import SidebarFilters from '@/components/search/SidebarFilters';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';

interface GoldenVisaPropertiesLayoutProps {
  children: ReactNode;
}

export default function GoldenVisaPropertiesLayout({ children }: GoldenVisaPropertiesLayoutProps) {
  return (
    <PageLayout contentFullWidth breadcrumb={<PublicBreadCrumb />} wrapperClassName="pt-6 pb-0">
      {/* HERO SECTION */}
      <GoldenVisaHeroSection />

      {/* ELIGIBILITY GUIDE SECTION */}
      <SectionCard
        eyebrow="Eligibility guide"
        title="What to check before applying"
        description="Use the listings as a shortlist, then verify value, ownership, and documents."
        className="bg-background"
        align="center"
      >
        <GoldenVisaEligibilityGuideContent />
      </SectionCard>

      {/* FILTERED PROPERTIES SECTION */}
      <SectionCard
        id="properties"
        eyebrow="AED 2M+ shortlist"
        title="Golden Visa eligible properties"
        description="Filter Dubai listings that meet the property-value path for Golden Visa review."
        className="bg-muted/45"
        align="center"
      >
        {/* TOP FILTERS */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <SearchFilters />
        </div>
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start xl:grid-cols-[19rem_minmax(0,1fr)]">
          {/* FILTER SIDEBAR */}
          <aside className="rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-28">
            <SidebarFilters />
          </aside>

          {/* SERVER PROPERTY RESULTS */}
          <div className="min-w-0">{children}</div>
        </div>
      </SectionCard>

      {/* CONSULTATION SECTION */}
      <SectionCard
        id="consultation"
        eyebrow="Next step"
        title="Check your Golden Visa property path"
        description="Share your budget, nationality, and timeline. The team can help confirm which listings are worth reviewing for eligibility."
        className="bg-[oklch(0.965_0.012_260.47)]"
        align="center"
      >
        <GoldenVisaConsultationContent />
      </SectionCard>
    </PageLayout>
  );
}
