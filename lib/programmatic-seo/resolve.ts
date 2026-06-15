import { getAreaBySlug, getAreasWithCityAdmin } from '@/lib/db/areas/queries';
import { getBuildingBySlugOnly, getBuildingsByArea } from '@/lib/db/buildings/queries';
import { getCategoriesAdmin } from '@/lib/db/categories/queries';
import { getDeveloperBySlug, getDevelopers } from '@/lib/db/developers/queries';
import { getPropertyBySlug } from '@/lib/db/properties/queries';
import { parseAreaRentalYieldSlug, parseAreaVsAreaSlug, parseBuildingReviewSlug, parseDeveloperAreaSlug, parsePropertyOffPlanSlug, parsePropertyTypeAreaSlug } from '@/lib/utils/programmatic-seo';
import type { AreaRentalYieldContext, AreaVsAreaContext, BuildingReviewContext, DeveloperAreaContext, ProgrammaticSeoContext, PropertyOffPlanContext } from './types';

export function isDeveloperAreaContext(context: ProgrammaticSeoContext): context is DeveloperAreaContext {
  return context.template.kind === 'developer_area';
}

export function isBuildingReviewContext(context: ProgrammaticSeoContext): context is BuildingReviewContext {
  return context.template.kind === 'building_review';
}

export function isPropertyOffPlanContext(context: ProgrammaticSeoContext): context is PropertyOffPlanContext {
  return context.template.kind === 'property_off_plan';
}

export function isAreaVsAreaContext(context: ProgrammaticSeoContext): context is AreaVsAreaContext {
  return context.template.kind === 'area_vs_area';
}

export function isAreaRentalYieldContext(context: ProgrammaticSeoContext): context is AreaRentalYieldContext {
  return context.template.kind === 'area_rental_yield';
}

export async function resolveProgrammaticSeoContext(slug: string): Promise<ProgrammaticSeoContext | null> {
  const buildingReviewTemplate = parseBuildingReviewSlug(slug);

  if (buildingReviewTemplate) {
    const buildingResponse = await getBuildingBySlugOnly(buildingReviewTemplate.buildingSlug);

    if (!buildingResponse.success || !buildingResponse.data) {
      return null;
    }

    return {
      template: buildingReviewTemplate,
      building: buildingResponse.data,
    };
  }

  const propertyOffPlanTemplate = parsePropertyOffPlanSlug(slug);

  if (propertyOffPlanTemplate) {
    const propertyResponse = await getPropertyBySlug(propertyOffPlanTemplate.propertySlug);

    if (!propertyResponse.success || !propertyResponse.data || propertyResponse.data.status !== 'off_plan') {
      return null;
    }

    return {
      template: propertyOffPlanTemplate,
      property: propertyResponse.data,
    };
  }

  const areaRentalYieldTemplate = parseAreaRentalYieldSlug(slug);

  if (areaRentalYieldTemplate) {
    const areaResponse = await getAreaBySlug(areaRentalYieldTemplate.areaSlug);

    if (!areaResponse.success || !areaResponse.data || !areaResponse.data.city?.slug) {
      return null;
    }

    const buildingsResponse = await getBuildingsByArea(areaResponse.data.city.slug, areaResponse.data.slug);
    const buildings = (buildingsResponse.success ? (buildingsResponse.data ?? []) : []).filter((building) => typeof building.rental_yield === 'number');

    if (buildings.length === 0) {
      return null;
    }

    return {
      template: areaRentalYieldTemplate,
      area: areaResponse.data,
      buildings,
    };
  }

  if (slug.includes('-vs-')) {
    const areasResponse = await getAreasWithCityAdmin();
    const areas = areasResponse.success ? (areasResponse.data?.data ?? []) : [];
    const areaVsAreaTemplate = parseAreaVsAreaSlug(slug, areas);

    if (areaVsAreaTemplate) {
      const [primaryAreaResponse, secondaryAreaResponse] = await Promise.all([getAreaBySlug(areaVsAreaTemplate.primaryAreaSlug), getAreaBySlug(areaVsAreaTemplate.secondaryAreaSlug)]);

      if (!primaryAreaResponse.success || !primaryAreaResponse.data || !secondaryAreaResponse.success || !secondaryAreaResponse.data) {
        return null;
      }

      return {
        template: areaVsAreaTemplate,
        primaryArea: primaryAreaResponse.data,
        secondaryArea: secondaryAreaResponse.data,
      };
    }
  }

  const [categoriesResponse, developersResponse] = await Promise.all([getCategoriesAdmin(), getDevelopers()]);
  const categories = (categoriesResponse.success ? (categoriesResponse.data?.data ?? []) : []).filter((category) => category.slug !== 'uncategorized');
  const developers = developersResponse.success ? (developersResponse.data ?? []) : [];
  const propertyTypeAreaTemplate = parsePropertyTypeAreaSlug(slug, categories);

  if (propertyTypeAreaTemplate) {
    const areaResponse = await getAreaBySlug(propertyTypeAreaTemplate.areaSlug);
    const category = categories.find((item) => item.slug === propertyTypeAreaTemplate.propertyTypeSlug) ?? null;

    if (!areaResponse.success || !areaResponse.data || !category) {
      return null;
    }

    return {
      template: propertyTypeAreaTemplate,
      area: areaResponse.data,
      category,
    };
  }

  const developerAreaTemplate = parseDeveloperAreaSlug(slug, developers);

  if (!developerAreaTemplate) {
    return null;
  }

  const [areaResponse, developerResponse] = await Promise.all([getAreaBySlug(developerAreaTemplate.areaSlug), getDeveloperBySlug(developerAreaTemplate.developerSlug)]);

  if (!areaResponse.success || !areaResponse.data || !developerResponse.success || !developerResponse.data) {
    return null;
  }

  return {
    template: developerAreaTemplate,
    area: areaResponse.data,
    developer: developerResponse.data,
  };
}
