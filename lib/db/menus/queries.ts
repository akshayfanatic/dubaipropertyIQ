'use server';

/**
 * Navigation Menu Queries
 * Server-side menu data for public navigation.
 */

import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';

export type NavigationLink = {
  label: string;
  href: string;
  id?: string;
};

export type NavigationSection = {
  title: string;
  href?: string;
  links: NavigationLink[];
};

export type NavigationMenu = {
  label: string;
  sections: NavigationSection[];
};

export type HeaderMenus = {
  explore: NavigationMenu;
  resources: NavigationMenu;
  topLevelLinks: NavigationLink[];
};

export type HeaderMenuOptions = {
  areaLimit?: number;
  propertyLimit?: number;
  developerLimit?: number;
};

type AreaMenuRow = {
  name: string;
  slug: string;
  cities: { slug: string } | { slug: string }[] | null;
};

const DEFAULT_AREA_LIMIT = 5;
const DEFAULT_PROPERTY_LIMIT = 5;
const DEFAULT_DEVELOPER_LIMIT = 5;

const guideLinks: NavigationLink[] = [
  { label: 'Buying Guide', href: '/pages/buying-guide' },
  { label: 'Investment Guide', href: '/pages/investment-guide' },
  { label: 'Golden Visa Guide', href: '/pages/golden-visa-guide' },
  { label: 'Dubai Area Guide', href: '/areas/dubai' },
];

const companyLinks: NavigationLink[] = [
  { label: 'About Dubai Property IQ', href: '/about' },
  { label: 'Customer Account', href: '/customer' },
  { label: 'Privacy Policy', href: '/pages/privacy-policy' },
  { label: 'Terms & Conditions', href: '/pages/terms-conditions' },
];

const topLevelLinks: NavigationLink[] = [
  { label: 'Search', href: '/search' },
  { label: 'Mortgage', href: '/calculators/mortgage-calculator' },
  { label: 'Rent vs Buy', href: '/calculators/rent-vs-buy-calculator' },
];

function firstOrValue<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function buildHeaderMenus(params: { areaLinks: NavigationLink[]; propertyLinks: NavigationLink[]; developerLinks: NavigationLink[] }): HeaderMenus {
  const propertySections: NavigationSection[] = [
    {
      title: 'Popular Areas',
      href: '/areas/dubai',
      links: params.areaLinks,
    },
    {
      title: 'Developers',
      links: params.developerLinks,
    },
  ];

  if (params.propertyLinks.length > 0) {
    propertySections.splice(1, 0, {
      title: 'Featured Properties',
      href: '/search',
      links: params.propertyLinks,
    });
  }

  return {
    explore: {
      label: 'Explore',
      sections: propertySections,
    },
    resources: {
      label: 'Resources',
      sections: [
        {
          title: 'Guides',
          links: guideLinks,
        },
        {
          title: 'Company',
          links: companyLinks,
        },
      ],
    },
    topLevelLinks,
  };
}

export async function getHeaderMenus(options: HeaderMenuOptions = {}): Promise<ApiResponse<HeaderMenus>> {
  try {
    /* --------------------------------------------------------------------------
     * Setup
     * -------------------------------------------------------------------------- */
    const supabase = await serverClient();
    const areaLimit = options.areaLimit ?? DEFAULT_AREA_LIMIT;
    const propertyLimit = options.propertyLimit ?? DEFAULT_PROPERTY_LIMIT;
    const developerLimit = options.developerLimit ?? DEFAULT_DEVELOPER_LIMIT;

    /* --------------------------------------------------------------------------
     * Popular Area Links
     * --------------------------------------------------------------------------
     * Area routes need both city slug and area slug: /areas/[city]/[area].
     */
    const areasResult = await supabase.from('areas').select('name, slug, cities!inner(slug)').order('name', { ascending: true }).limit(areaLimit);

    if (areasResult.error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: areasResult.error.message,
        error: { code: areasResult.error.code || 'QUERY_ERROR' },
      });
    }

    const areas = (areasResult.data ?? []) as AreaMenuRow[];
    const areaLinks: NavigationLink[] = areas.map((area) => {
      const city = firstOrValue(area.cities);

      return {
        label: area.name,
        href: `/areas/${city?.slug ?? 'dubai'}/${area.slug}`, // default city to dubai
      };
    });

    /* --------------------------------------------------------------------------
     * Featured Property Links
     * --------------------------------------------------------------------------
     * Featured properties appear as an optional menu section when results exist.
     */
    const propertiesResult = await supabase.from('properties').select('title, slug').eq('is_featured', true).order('updated_at', { ascending: false }).limit(propertyLimit);

    if (propertiesResult.error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: propertiesResult.error.message,
        error: { code: propertiesResult.error.code || 'QUERY_ERROR' },
      });
    }

    const propertyLinks: NavigationLink[] = (propertiesResult.data ?? []).map((property) => ({
      label: property.title,
      href: `/properties/${property.slug}`,
    }));

    /* --------------------------------------------------------------------------
     * Developer Links
     * --------------------------------------------------------------------------
     * Developer routes use the public profile page: /developers/[slug].
     */
    const developersResult = await supabase.from('developers').select('name, slug').order('name', { ascending: true }).limit(developerLimit);

    if (developersResult.error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: developersResult.error.message,
        error: { code: developersResult.error.code || 'QUERY_ERROR' },
      });
    }

    const developerLinks: NavigationLink[] = (developersResult.data ?? []).map((developer) => ({
      label: developer.name,
      href: `/developers/${developer.slug}`,
    }));

    /* --------------------------------------------------------------------------
     * Final Menu Response
     * -------------------------------------------------------------------------- */
    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Header menus fetched successfully',
      data: buildHeaderMenus({
        areaLinks,
        propertyLinks,
        developerLinks,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch header menus';

    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
