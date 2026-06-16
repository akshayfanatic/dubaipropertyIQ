import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/utils/seo';
import {
  getAreaRentalYieldDescription,
  getAreaRentalYieldTitle,
  getAreaVsAreaDescription,
  getAreaVsAreaTitle,
  getBuildingReviewDescription,
  getBuildingReviewTitle,
  getDeveloperAreaDescription,
  getDeveloperAreaTitle,
  getPropertyOffPlanDescription,
  getPropertyOffPlanTitle,
  getPropertyTypeAreaDescription,
  getPropertyTypeAreaTitle,
} from '@/lib/utils/programmatic-seo';
import { isAreaRentalYieldContext, isAreaVsAreaContext, isBuildingReviewContext, isDeveloperAreaContext, isPropertyOffPlanContext } from './resolve';
import type { ProgrammaticSeoContext } from './types';

export function getProgrammaticTitle(context: ProgrammaticSeoContext) {
  if (isBuildingReviewContext(context)) {
    return getBuildingReviewTitle(context.building);
  }

  if (isPropertyOffPlanContext(context)) {
    return getPropertyOffPlanTitle(context.property);
  }

  if (isAreaVsAreaContext(context)) {
    return getAreaVsAreaTitle(context.primaryArea, context.secondaryArea);
  }

  if (isAreaRentalYieldContext(context)) {
    return getAreaRentalYieldTitle(context.area);
  }

  return isDeveloperAreaContext(context) ? getDeveloperAreaTitle(context.template, context.area.name) : getPropertyTypeAreaTitle(context.template, context.area.name);
}

export function getProgrammaticDescription(context: ProgrammaticSeoContext, totalListings?: number) {
  if (isBuildingReviewContext(context)) {
    return getBuildingReviewDescription(context.building);
  }

  if (isPropertyOffPlanContext(context)) {
    return getPropertyOffPlanDescription(context.property);
  }

  if (isAreaVsAreaContext(context)) {
    return getAreaVsAreaDescription(context.primaryArea, context.secondaryArea);
  }

  if (isAreaRentalYieldContext(context)) {
    return getAreaRentalYieldDescription(context.area);
  }

  return isDeveloperAreaContext(context)
    ? getDeveloperAreaDescription(context.template, context.area.name, totalListings)
    : getPropertyTypeAreaDescription(context.template, context.area.name, totalListings);
}

export function getProgrammaticImage(context: ProgrammaticSeoContext) {
  if (isBuildingReviewContext(context)) {
    const image = context.building.buildings_seo?.og_image_url || context.building.photos?.[0];
    return typeof image === 'string' ? { url: image, alt_tag: context.building.name } : image;
  }

  if (isPropertyOffPlanContext(context)) {
    const image = context.property.properties_seo?.og_image_url || context.property.photos?.[0];
    return typeof image === 'string' ? { url: image, alt_tag: context.property.title } : image;
  }

  if (isAreaVsAreaContext(context)) {
    return context.primaryArea.photos?.[0] || context.secondaryArea.photos?.[0];
  }

  if (isAreaRentalYieldContext(context)) {
    return context.area.photos?.[0] || context.buildings[0]?.photos?.[0];
  }

  if (isDeveloperAreaContext(context)) {
    const logo = context.developer.developers_seo?.og_image_url || context.developer.logo_url;
    return typeof logo === 'string' ? { url: logo, alt_tag: context.developer.name } : logo;
  }

  return context.area.photos?.[0];
}

export function getProgrammaticKeywords(context: ProgrammaticSeoContext, title: string) {
  if (isBuildingReviewContext(context)) {
    return [title, `${context.building.name} review`, `${context.building.name} service charges`, `${context.building.name} rental yield`];
  }

  if (isPropertyOffPlanContext(context)) {
    return [
      title,
      `${context.property.title} off-plan`,
      `${context.property.title} Dubai`,
      context.property.developer?.name ? `${context.property.developer.name} off-plan` : 'Dubai off-plan property',
    ];
  }

  if (isAreaVsAreaContext(context)) {
    return [title, `${context.primaryArea.name} vs ${context.secondaryArea.name}`, `${context.primaryArea.name} properties`, `${context.secondaryArea.name} properties`];
  }

  if (isAreaRentalYieldContext(context)) {
    return [title, `${context.area.name} rental yield`, `${context.area.name} ROI`, `${context.area.name} investment property`];
  }

  if (isDeveloperAreaContext(context)) {
    return [title, `${context.developer.name} properties`, `${context.area.name} properties`, `${context.developer.name} ${context.area.name}`];
  }

  return [title, `${context.area.name} properties`, `${context.template.propertyTypeLabel.toLowerCase()} Dubai`];
}

export function createProgrammaticMetadata(context: ProgrammaticSeoContext): Metadata {
  const title = getProgrammaticTitle(context);
  const description = getProgrammaticDescription(context);
  const image = getProgrammaticImage(context);

  return createPageMetadata({
    title: `${title} | Dubai Property IQ`,
    description,
    path: `/${context.template.slug}`,
    keywords: getProgrammaticKeywords(context, title),
    image: image?.url,
    imageAlt: image?.alt_tag || title,
  });
}
