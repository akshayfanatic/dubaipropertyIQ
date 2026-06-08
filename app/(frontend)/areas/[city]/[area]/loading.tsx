import PageLayout from '@/components/layout/PageLayout';
import { PageBanner } from '@/components/shared/PageBanner';
import { SectionCard } from '@/components/shared/SectionCard';
import { ScrollToTopOnMount } from '@/components/shared/ScrollToTopOnMount';
import { Skeleton } from '@/components/ui/skeleton';

const sectionClasses = {
  wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] gap-4 md:gap-8',
  eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
  title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
};

function QuickNavSkeleton() {
  return (
    <div className="sticky top-16 z-40 border-b border-border bg-[oklch(0.985_0.008_260.47_/_0.92)] shadow-[0_10px_28px_oklch(0.2_0.03_263.61_/_0.06)] backdrop-blur-[18px] backdrop-saturate-[1.18]">
      <div className="mx-auto w-[min(92%,1440px)]">
        <div className="flex min-h-[76px] items-center justify-start gap-2 overflow-hidden py-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-[clamp(7rem,13vw,10rem)] shrink-0 rounded-full bg-primary/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
          <Skeleton className="aspect-[0.86] w-full rounded-none bg-muted" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <PageLayout contentFullWidth wrapperClassName="py-0">
      <ScrollToTopOnMount />

      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      <PageBanner
        heightClassName="min-h-[360px] sm:min-h-[560px]"
        contentClassName="container mx-auto flex min-h-[360px] flex-col justify-center px-4 sm:min-h-[560px] sm:px-6 lg:px-8"
        className="bg-[oklch(0.24_0.05_260.47)]"
      >
        <div className="max-w-3xl space-y-5">
          <Skeleton className="h-8 w-48 rounded-full bg-primary-foreground/18" />
          <Skeleton className="h-14 w-full max-w-xl bg-primary-foreground/18 sm:h-18" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-28 rounded-full bg-primary-foreground/16" />
            ))}
          </div>
        </div>
      </PageBanner>

      <QuickNavSkeleton />

      <SectionCard eyebrow="General information" title="Overview" className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]" classes={sectionClasses}>
        <div className="rounded-[18px] border border-border bg-card p-[clamp(1.35rem,3vw,2.2rem)] shadow-sm">
          <div className="max-w-4xl space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Skeleton className="h-8 w-44 rounded-full" />
            <Skeleton className="h-8 w-36 rounded-full" />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Area report"
        title="Download area report"
        description="Get a focused community snapshot before comparing listings."
        className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
        classes={sectionClasses}
      >
        <div className="rounded-[18px] border border-border bg-card p-[clamp(1.35rem,3vw,2.2rem)] shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg md:col-span-2" />
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Community gallery" title="Gallery" className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]" classes={sectionClasses}>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <Skeleton className="min-h-[320px] rounded-[18px] bg-muted sm:min-h-[420px]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Skeleton className="min-h-40 rounded-[18px] bg-muted" />
            <Skeleton className="min-h-40 rounded-[18px] bg-muted" />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Building intelligence"
        title="Buildings"
        description="Loading building-level signals and connected reports."
        className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
        classes={sectionClasses}
      >
        <CardSkeletonGrid />
      </SectionCard>
    </PageLayout>
  );
}
