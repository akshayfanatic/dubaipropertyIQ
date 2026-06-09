import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import { PublicBreadCrumb } from '@/components/shared/PublicBreadCrumb';
import { DeveloperProfileCard } from '@/components/developers/profile/DeveloperProfileCard';
import { PageBanner } from '@/components/shared/PageBanner';
import { DeveloperStats } from '@/components/developers/profile/DeveloperStats';
import { SectionCard } from '@/components/shared/SectionCard';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { DeveloperInquiryForm } from '@/components/developers/forms/DeveloperInquiryForm';
import { PropertyCardSkeleton } from '@/components/properties/card';
import { getDeveloperBySlug } from '@/lib/db/developers/queries';
import { ImageObject } from '@/types/images';
import SearchFilters from '@/components/search/SearchFilters';
import SidebarFilters from '@/components/search/SidebarFilters';

export function PropertiesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

type DeveloperLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

const developerSectionClasses = {
  wrapper: 'mb-[clamp(1.8rem,4vw,3rem)] items-center text-center',
  eyebrow: 'text-xs font-extrabold tracking-[0.15em] before:w-[22px]',
  title: 'text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight',
  description: 'mx-auto max-w-[500px] font-medium',
};

export async function generateMetadata({ params }: DeveloperLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: developer, success } = await getDeveloperBySlug(slug);

  if (!success || !developer) {
    return {
      title: 'Developer Not Found',
    };
  }

  const seo = developer.developers_seo;
  const logoUrl = typeof developer.logo_url === 'string' ? developer.logo_url : (developer.logo_url as ImageObject | null)?.url;
  const title = seo?.meta_title || `${developer.name} Properties & Projects in Dubai`;
  const description = seo?.meta_description || developer.description || `Browse Dubai properties and projects by ${developer.name}.`;
  const image = seo?.og_image_url || logoUrl;
  const canonical = seo?.canonical_url || `/developers/${developer.slug}`;
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
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function DeveloperLayout({ children, params }: DeveloperLayoutProps) {
  const { slug } = await params;
  const { data: developer, success } = await getDeveloperBySlug(slug);

  if (!success || !developer) {
    notFound();
  }

  // Map logo_url if it's an ImageObject
  const logoUrl = typeof developer.logo_url === 'string' ? developer.logo_url : (developer.logo_url as ImageObject | null)?.url;

  const keyStats = {
    totalProjects: developer.total_projects || 0,
    totalUnitsDelivered: developer.completed_projects || 0,
    yearsActive: developer.years_active || 0,
    activeProjects: developer.ongoing_projects || 0,
  };

  return (
    <PageLayout contentFullWidth={true} breadcrumb={<PublicBreadCrumb />}>
      {/* Developer Banner */}
      <PageBanner contentClassName="container sm:max-w-full mx-auto px-4 sm:px-16  h-112" imageUrl="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=1600&auto=format&fit=crop">
        <DeveloperProfileCard
          name={developer.name}
          logoUrl={logoUrl}
          description={developer.description}
          email={null} // Table doesn't have email yet
          websiteUrl={developer.website_url}
        />
      </PageBanner>

      {/* Developer Stats */}
      <AnimateSection>
        <SectionCard
          eyebrow="Developer overview"
          title="Overview"
          description="Key developer stats."
          align="center"
          className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
          classes={developerSectionClasses}
        >
          <DeveloperStats keyStats={keyStats} />
        </SectionCard>
      </AnimateSection>

      {/* Properties Section Wrapper */}
      <SectionCard
        eyebrow="Developer inventory"
        title={`Curated property by ${developer.name}.`}
        description="Browse active listings."
        align="center"
        className="bg-[oklch(0.935_0.018_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
        contentClassName="space-y-8"
        classes={developerSectionClasses}
      >
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

      <AnimateSection>
        <SectionCard
          eyebrow="Developer information"
          title="Get Developer Information"
          description={`Request availability, pricing context, and matching projects from ${developer.name}.`}
          align="center"
          className="bg-[oklch(0.965_0.012_260.47)] py-[clamp(3.6rem,7vw,6.5rem)]"
          classes={developerSectionClasses}
        >
          <DeveloperInquiryForm developerName={developer.name} />
        </SectionCard>
      </AnimateSection>
    </PageLayout>
  );
}
