import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createProgrammaticMetadata } from '@/lib/programmatic-seo/metadata';
import { isAreaRentalYieldContext, isAreaVsAreaContext, isBuildingReviewContext, isPropertyOffPlanContext, resolveProgrammaticSeoContext } from '@/lib/programmatic-seo/resolve';
import { AreaRentalYieldProgrammaticPage } from '@/components/programmatic-seo/AreaRentalYieldProgrammaticPage';
import { AreaVsAreaProgrammaticPage } from '@/components/programmatic-seo/AreaVsAreaProgrammaticPage';
import { BuildingReviewProgrammaticPage } from '@/components/programmatic-seo/BuildingReviewProgrammaticPage';
import { ListingProgrammaticPage } from '@/components/programmatic-seo/ListingProgrammaticPage';
import { PropertyOffPlanProgrammaticPage } from '@/components/programmatic-seo/PropertyOffPlanProgrammaticPage';

type ProgrammaticPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({ params }: ProgrammaticPageProps): Promise<Metadata> {
  const { slug } = await params;
  const context = await resolveProgrammaticSeoContext(slug);

  return context ? createProgrammaticMetadata(context) : {};
}

export default async function ProgrammaticPage({ params, searchParams }: ProgrammaticPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const context = await resolveProgrammaticSeoContext(slug);

  if (!context) {
    notFound();
  }

  if (isBuildingReviewContext(context)) {
    return <BuildingReviewProgrammaticPage context={context} />;
  }

  if (isPropertyOffPlanContext(context)) {
    return <PropertyOffPlanProgrammaticPage context={context} />;
  }

  if (isAreaVsAreaContext(context)) {
    return <AreaVsAreaProgrammaticPage context={context} />;
  }

  if (isAreaRentalYieldContext(context)) {
    return <AreaRentalYieldProgrammaticPage context={context} />;
  }

  const page = Number(resolvedSearchParams?.page || 1);
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;

  return <ListingProgrammaticPage context={context} page={currentPage} />;
}
