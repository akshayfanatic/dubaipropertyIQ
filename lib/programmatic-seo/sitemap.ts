import type { MetadataRoute } from 'next';
import { adminClient } from '@/lib/supabase/admin';
import { siteUrl } from '@/lib/utils/seo';
import { getAreaRentalYieldPath, getAreaVsAreaPath, getBuildingReviewPath, getDeveloperAreaPath, getPropertyOffPlanPath, getPropertyTypeAreaPath } from '@/lib/utils/programmatic-seo';

type SitemapRow = {
  slug: string;
  updated_at?: string | null;
  created_at?: string | null;
};

type ProgrammaticPropertyAreaRow = {
  properties?:
    | (SitemapRow & {
        categories?: { slug: string } | { slug: string }[] | null;
        developers?: { slug: string } | { slug: string }[] | null;
      })
    | null;
  areas?: { slug: string } | { slug: string }[] | null;
};

type BuildingAreaMetricRow = SitemapRow & {
  rental_yield?: number | null;
  areas?: (SitemapRow & { slug: string }) | (SitemapRow & { slug: string })[] | null;
};

const baseUrl = siteUrl.replace(/\/$/, '');

function firstOrValue<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function lastModified(row?: Pick<SitemapRow, 'updated_at' | 'created_at'> | null) {
  return row?.updated_at || row?.created_at || new Date();
}

function entry(path: string, row?: Pick<SitemapRow, 'updated_at' | 'created_at'> | null, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: `${baseUrl}${path}`,
    lastModified: lastModified(row),
    changeFrequency: 'weekly',
    priority,
  };
}

export async function getProgrammaticSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const supabase = adminClient();
  const [buildingsResult, programmaticResult, offPlanResult, areasResult, rentalYieldBuildingsResult] = await Promise.all([
    supabase.from('buildings').select('slug, updated_at, created_at').order('name', { ascending: true }),
    supabase
      .from('areas_properties')
      .select(
        `
          areas!inner(slug),
          properties!inner(
            slug,
            updated_at,
            created_at,
            status,
            categories!inner(slug),
            developers(slug)
          )
        `,
      )
      .eq('properties.status', 'available'),
    supabase.from('properties').select('slug, updated_at, created_at').eq('status', 'off_plan').order('title', { ascending: true }),
    supabase.from('areas').select('slug, updated_at, created_at').order('name', { ascending: true }),
    supabase.from('buildings').select('slug, updated_at, created_at, rental_yield, areas!inner(slug, updated_at, created_at)').not('rental_yield', 'is', null),
  ]);

  const programmaticMap = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const building of (buildingsResult.data as SitemapRow[] | null) ?? []) {
    programmaticMap.set(getBuildingReviewPath(building.slug), entry(getBuildingReviewPath(building.slug), building, 0.72));
  }

  for (const property of (offPlanResult.data as SitemapRow[] | null) ?? []) {
    programmaticMap.set(getPropertyOffPlanPath(property.slug), entry(getPropertyOffPlanPath(property.slug), property, 0.74));
  }

  const areas = (areasResult.data as SitemapRow[] | null) ?? [];

  for (let primaryIndex = 0; primaryIndex < areas.length; primaryIndex += 1) {
    for (let secondaryIndex = primaryIndex + 1; secondaryIndex < areas.length; secondaryIndex += 1) {
      const primaryArea = areas[primaryIndex];
      const secondaryArea = areas[secondaryIndex];
      const path = getAreaVsAreaPath(primaryArea.slug, secondaryArea.slug);
      const latestRow = new Date(lastModified(primaryArea)) > new Date(lastModified(secondaryArea)) ? primaryArea : secondaryArea;

      programmaticMap.set(path, entry(path, latestRow, 0.68));
    }
  }

  for (const building of (rentalYieldBuildingsResult.data as BuildingAreaMetricRow[] | null) ?? []) {
    const area = firstOrValue(building.areas);

    if (!area?.slug) {
      continue;
    }

    const path = getAreaRentalYieldPath(area.slug);
    const current = entry(path, building, 0.7);
    const existing = programmaticMap.get(path);

    if (!existing || new Date(current.lastModified ?? 0) > new Date(existing.lastModified ?? 0)) {
      programmaticMap.set(path, current);
    }
  }

  for (const row of (programmaticResult.data as ProgrammaticPropertyAreaRow[] | null) ?? []) {
    const property = row.properties;
    const area = firstOrValue(row.areas);
    const category = firstOrValue(property?.categories);

    if (!property || !area?.slug || !category?.slug || category.slug === 'uncategorized') {
      continue;
    }

    const propertyTypeAreaPath = getPropertyTypeAreaPath(category.slug, area.slug);
    const current = entry(propertyTypeAreaPath, property, 0.75);
    const existing = programmaticMap.get(propertyTypeAreaPath);

    if (!existing || new Date(current.lastModified ?? 0) > new Date(existing.lastModified ?? 0)) {
      programmaticMap.set(propertyTypeAreaPath, current);
    }

    const developer = firstOrValue(property.developers);

    if (!developer?.slug) {
      continue;
    }

    const developerAreaPath = getDeveloperAreaPath(developer.slug, area.slug);
    const developerExisting = programmaticMap.get(developerAreaPath);

    if (!developerExisting || new Date(current.lastModified ?? 0) > new Date(developerExisting.lastModified ?? 0)) {
      programmaticMap.set(developerAreaPath, entry(developerAreaPath, property, 0.75));
    }
  }

  return [...programmaticMap.values()];
}
