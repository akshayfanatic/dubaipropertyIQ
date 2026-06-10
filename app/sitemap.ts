import type { MetadataRoute } from 'next';
import { adminClient } from '@/lib/supabase/admin';
import { siteUrl } from '@/lib/utils/seo';

type SitemapRow = {
  slug: string;
  updated_at?: string | null;
  created_at?: string | null;
};

type CityRow = SitemapRow;

type AreaRow = SitemapRow & {
  cities?: { slug: string } | { slug: string }[] | null;
};

type BuildingRow = SitemapRow & {
  cities?: { slug: string } | { slug: string }[] | null;
  areas?: { slug: string } | { slug: string }[] | null;
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = adminClient();

  const [citiesResult, areasResult, buildingsResult, propertiesResult, developersResult, blogsResult, pagesResult] = await Promise.all([
    supabase.from('cities').select('slug, updated_at, created_at').order('name', { ascending: true }),
    supabase.from('areas').select('slug, updated_at, created_at, cities!inner(slug)').order('name', { ascending: true }),
    supabase.from('buildings').select('slug, updated_at, created_at, cities!inner(slug), areas!inner(slug)').order('name', { ascending: true }),
    supabase.from('properties').select('slug, updated_at, created_at').eq('status', 'available').order('updated_at', { ascending: false }),
    supabase.from('developers').select('slug, updated_at, created_at').order('name', { ascending: true }),
    supabase.from('blogs').select('slug, updated_at, created_at').eq('is_published', true).order('created_at', { ascending: false }),
    supabase.from('pages').select('slug, updated_at, created_at').eq('is_published', true).order('title', { ascending: true }),
  ]);

  const staticEntries = [
    entry('/', null, 1),
    entry('/search', null, 0.9),
    entry('/golden-visa-properties', null, 0.9),
    entry('/blogs', null, 0.8),
    entry('/about', null, 0.6),
    entry('/calculators/mortgage-calculator', null, 0.7),
    entry('/calculators/rent-vs-buy-calculator', null, 0.7),
  ];

  const cityEntries = (citiesResult.data as CityRow[] | null)?.map((city) => entry(`/areas/${city.slug}`, city, 0.8)) ?? [];

  const areaEntries =
    (areasResult.data as AreaRow[] | null)
      ?.map((area) => {
        const city = firstOrValue(area.cities);
        return city?.slug ? entry(`/areas/${city.slug}/${area.slug}`, area, 0.8) : null;
      })
      .filter((item): item is MetadataRoute.Sitemap[number] => Boolean(item)) ?? [];

  const buildingEntries =
    (buildingsResult.data as BuildingRow[] | null)
      ?.map((building) => {
        const city = firstOrValue(building.cities);
        const area = firstOrValue(building.areas);
        return city?.slug && area?.slug ? entry(`/areas/${city.slug}/${area.slug}/${building.slug}`, building, 0.7) : null;
      })
      .filter((item): item is MetadataRoute.Sitemap[number] => Boolean(item)) ?? [];

  const propertyEntries = (propertiesResult.data as SitemapRow[] | null)?.map((property) => entry(`/properties/${property.slug}`, property, 0.9)) ?? [];

  const developerEntries = (developersResult.data as SitemapRow[] | null)?.map((developer) => entry(`/developers/${developer.slug}`, developer, 0.7)) ?? [];

  const blogEntries = (blogsResult.data as SitemapRow[] | null)?.map((blog) => entry(`/blogs/${blog.slug}`, blog, 0.7)) ?? [];

  const pageEntries = (pagesResult.data as SitemapRow[] | null)?.map((page) => entry(`/pages/${page.slug}`, page, 0.6)) ?? [];

  return [...staticEntries, ...cityEntries, ...areaEntries, ...buildingEntries, ...propertyEntries, ...developerEntries, ...blogEntries, ...pageEntries];
}
