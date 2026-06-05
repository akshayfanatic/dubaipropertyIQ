import { CheckCircle2 } from 'lucide-react';
import { PropertyCardSlide } from '@/components/properties/card';
import { SectionCard } from '@/components/shared/SectionCard';
import { SliderSection } from '@/components/sliders/SliderSection';
import type { PropertyListItem } from '@/types/property';

interface GoldenVisaListingsSectionProps {
  properties: PropertyListItem[];
}

export function GoldenVisaListingsSection({ properties }: GoldenVisaListingsSectionProps) {
  if (properties.length === 0) {
    return (
      <SectionCard
        id="properties"
        eyebrow="AED 2M+ shortlist"
        title="Golden Visa eligible properties"
        description="These listings are marked as Golden Visa eligible in the property database."
        className="bg-muted/45"
      >
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto size-9 text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">No eligible listings found</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Add Golden Visa eligible properties in admin, then they will appear here automatically.</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <div id="properties">
      <SliderSection
        eyebrow="AED 2M+ shortlist"
        title="Golden Visa eligible properties"
        description="These listings are marked as Golden Visa eligible in the property database."
        data={properties}
        SlideComponent={PropertyCardSlide}
        delay={2000}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        className="bg-muted/45"
      />
    </div>
  );
}
