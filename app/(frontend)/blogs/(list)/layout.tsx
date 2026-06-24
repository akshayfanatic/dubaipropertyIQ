import type { ReactNode } from 'react';
import Link from 'next/link';

import { BlogFilters } from '@/components/blogs/BlogFilters';
import { BlogHeroStats } from '@/components/blogs/BlogHeroStats';
import { BlogSidebar, BlogSidebarCard } from '@/components/blogs/BlogSidebar';
import { NewsletterLeadForm } from '@/components/leads/NewsletterLeadForm';
import PageLayout from '@/components/layout/PageLayout';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { SectionCard } from '@/components/shared/SectionCard';
import { Button } from '@/components/ui/button';
import { getBlogStats } from '@/lib/db/blogs/queries';

type BlogsLayoutProps = {
  children: ReactNode;
};

export default async function BlogsLayout({ children }: BlogsLayoutProps) {
  const statsResult = await getBlogStats();
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <PageLayout contentFullWidth wrapperClassName="pt-4">
      {/* BREADCRUMB SECTION */}
      <div className="mx-auto mb-6 w-[min(92%,1440px)]">
        <PublicBreadCrumb />
      </div>

      {/* HERO SECTION */}
      <SectionCard
        eyebrow="Market insights"
        title="Dubai property guides."
        description="Investor education, area research, off-plan checks, ownership costs, and market explainers for clearer buying decisions."
        className="bg-background py-7 sm:py-9"
        containerClassName="w-[min(92%,1440px)]"
        contentClassName="hidden"
        navigation={<BlogHeroStats stats={stats} />}
        classes={{ wrapper: 'mb-0' }}
      >
        {null}
      </SectionCard>

      {/* FILTER SECTION */}
      <div className="sticky top-16 z-30 border-y border-border bg-background/92 py-2 shadow-[0_10px_24px_oklch(0.2_0.03_263.61/0.05)] backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto w-[min(92%,1440px)]">
          <BlogFilters />
        </div>
      </div>

      {/* BLOG LISTING SECTION */}
      <section className="bg-background py-10 sm:py-12">
        <div className="mx-auto grid w-[min(92%,1440px)] gap-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          {/* SERVER BLOG RESULTS */}
          <main className="min-w-0">{children}</main>

          {/* SIDEBAR WIDGETS */}
          <BlogSidebar>
            {/* Newsletter */}
            <BlogSidebarCard
              eyebrow="Weekly brief"
              title="Get Dubai property insights in your inbox."
              description="One clean briefing with new guides, market notes, and buyer checks."
              variant="highlight"
            >
              <NewsletterLeadForm />
            </BlogSidebarCard>

            {/* Call to action */}
            <BlogSidebarCard eyebrow="Need help?" title="Turn research into a shortlist." description="Compare areas, budgets, and property options with a clearer buyer plan.">
              <PropertyWhatsAppButton variant="primary" label="Talk to advisor" className="h-11 rounded-xl" />
              <Button asChild variant="outline" className="h-11 rounded-xl bg-background font-bold">
                <Link href="/search">Explore properties</Link>
              </Button>
            </BlogSidebarCard>
          </BlogSidebar>
        </div>
      </section>
    </PageLayout>
  );
}
