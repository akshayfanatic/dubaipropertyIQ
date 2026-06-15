import type { AreaDetail } from '@/lib/db/areas/queries';
import type { BuildingWithRelations } from '@/types/building';
import type { Category } from '@/types/category';
import type { Developer } from '@/types/developer';
import type { Property, PropertyListItem } from '@/types/property';
import type { FAQ } from '@/types/shared';

export type PropertyTypeAreaTemplate = {
  kind: 'property_type_area';
  slug: string;
  propertyTypeSlug: string;
  propertyTypeLabel: string;
  areaSlug: string;
};

export type DeveloperAreaTemplate = {
  kind: 'developer_area';
  slug: string;
  developerSlug: string;
  developerName: string;
  areaSlug: string;
};

export type BuildingReviewTemplate = {
  kind: 'building_review';
  slug: string;
  buildingSlug: string;
};

export type PropertyOffPlanTemplate = {
  kind: 'property_off_plan';
  slug: string;
  propertySlug: string;
};

export type AreaVsAreaTemplate = {
  kind: 'area_vs_area';
  slug: string;
  primaryAreaSlug: string;
  secondaryAreaSlug: string;
};

export type AreaRentalYieldTemplate = {
  kind: 'area_rental_yield';
  slug: string;
  areaSlug: string;
};

type CategoryForTemplate = Pick<Category, 'name' | 'slug'>;
type DeveloperForTemplate = Pick<Developer, 'name' | 'slug'>;
type AreaForTemplate = Pick<AreaDetail, 'name' | 'slug'>;

function titleCaseSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function pluralizeSlug(slug: string) {
  if (slug === 'land') return slug;
  if (slug.endsWith('y')) return `${slug.slice(0, -1)}ies`;
  if (slug.endsWith('s')) return slug;
  return `${slug}s`;
}

export function getPropertyTypeAreaPath(categorySlug: string, areaSlug: string) {
  return `/${pluralizeSlug(categorySlug)}-for-sale-in-${areaSlug}`;
}

export function getDeveloperAreaPath(developerSlug: string, areaSlug: string) {
  return `/${developerSlug}-properties-in-${areaSlug}`;
}

export function getBuildingReviewPath(buildingSlug: string) {
  return `/${buildingSlug}-review`;
}

export function getPropertyOffPlanPath(propertySlug: string) {
  return `/${propertySlug}-off-plan`;
}

export function getAreaVsAreaPath(primaryAreaSlug: string, secondaryAreaSlug: string) {
  return `/${primaryAreaSlug}-vs-${secondaryAreaSlug}`;
}

export function getAreaRentalYieldPath(areaSlug: string) {
  return `/${areaSlug}-rental-yield`;
}

function getCategoryUrlSlugs(category: CategoryForTemplate) {
  return [...new Set([category.slug, pluralizeSlug(category.slug)])];
}

export function parsePropertyTypeAreaSlug(slug: string, categories: CategoryForTemplate[]): PropertyTypeAreaTemplate | null {
  const normalizedSlug = slug.trim().toLowerCase();

  for (const category of categories) {
    for (const categoryUrlSlug of getCategoryUrlSlugs(category)) {
      const prefix = `${categoryUrlSlug}-for-sale-in-`;

      if (!normalizedSlug.startsWith(prefix)) {
        continue;
      }

      const areaSlug = normalizedSlug.slice(prefix.length);

      if (!areaSlug || areaSlug.includes('--')) {
        return null;
      }

      return {
        kind: 'property_type_area',
        slug: normalizedSlug,
        propertyTypeSlug: category.slug,
        propertyTypeLabel: category.name || titleCaseSlug(category.slug),
        areaSlug,
      };
    }
  }

  return null;
}

export function parseDeveloperAreaSlug(slug: string, developers: DeveloperForTemplate[]): DeveloperAreaTemplate | null {
  const normalizedSlug = slug.trim().toLowerCase();

  for (const developer of developers) {
    const prefix = `${developer.slug}-properties-in-`;

    if (!normalizedSlug.startsWith(prefix)) {
      continue;
    }

    const areaSlug = normalizedSlug.slice(prefix.length);

    if (!areaSlug || areaSlug.includes('--')) {
      return null;
    }

    return {
      kind: 'developer_area',
      slug: normalizedSlug,
      developerSlug: developer.slug,
      developerName: developer.name,
      areaSlug,
    };
  }

  return null;
}

export function parseBuildingReviewSlug(slug: string): BuildingReviewTemplate | null {
  const normalizedSlug = slug.trim().toLowerCase();
  const suffix = '-review';

  if (!normalizedSlug.endsWith(suffix)) {
    return null;
  }

  const buildingSlug = normalizedSlug.slice(0, -suffix.length);

  if (!buildingSlug || buildingSlug.includes('--')) {
    return null;
  }

  return {
    kind: 'building_review',
    slug: normalizedSlug,
    buildingSlug,
  };
}

export function parsePropertyOffPlanSlug(slug: string): PropertyOffPlanTemplate | null {
  const normalizedSlug = slug.trim().toLowerCase();
  const suffix = '-off-plan';

  if (!normalizedSlug.endsWith(suffix)) {
    return null;
  }

  const propertySlug = normalizedSlug.slice(0, -suffix.length);

  if (!propertySlug || propertySlug.includes('--')) {
    return null;
  }

  return {
    kind: 'property_off_plan',
    slug: normalizedSlug,
    propertySlug,
  };
}

export function parseAreaVsAreaSlug(slug: string, areas: AreaForTemplate[]): AreaVsAreaTemplate | null {
  const normalizedSlug = slug.trim().toLowerCase();

  for (const primaryArea of areas) {
    const prefix = `${primaryArea.slug}-vs-`;

    if (!normalizedSlug.startsWith(prefix)) {
      continue;
    }

    const secondaryAreaSlug = normalizedSlug.slice(prefix.length);
    const secondaryArea = areas.find((area) => area.slug === secondaryAreaSlug);

    if (!secondaryArea || secondaryArea.slug === primaryArea.slug) {
      return null;
    }

    return {
      kind: 'area_vs_area',
      slug: normalizedSlug,
      primaryAreaSlug: primaryArea.slug,
      secondaryAreaSlug: secondaryArea.slug,
    };
  }

  return null;
}

export function parseAreaRentalYieldSlug(slug: string): AreaRentalYieldTemplate | null {
  const normalizedSlug = slug.trim().toLowerCase();
  const suffix = '-rental-yield';

  if (!normalizedSlug.endsWith(suffix)) {
    return null;
  }

  const areaSlug = normalizedSlug.slice(0, -suffix.length);

  if (!areaSlug || areaSlug.includes('--')) {
    return null;
  }

  return {
    kind: 'area_rental_yield',
    slug: normalizedSlug,
    areaSlug,
  };
}

export function getPropertyTypeAreaTitle(template: PropertyTypeAreaTemplate, areaName: string) {
  return `${template.propertyTypeLabel} for Sale in ${areaName}`;
}

export function getPropertyTypeAreaDescription(template: PropertyTypeAreaTemplate, areaName: string, totalListings?: number) {
  const listingCount = typeof totalListings === 'number' && totalListings > 0 ? ` Browse ${totalListings} available listings` : ' Browse available listings';
  return `${listingCount} for ${template.propertyTypeLabel.toLowerCase()} for sale in ${areaName}, with prices, bedrooms, size, Golden Visa signals, and investor-focused property details.`;
}

export function getDeveloperAreaTitle(template: DeveloperAreaTemplate, areaName: string) {
  return `${template.developerName} Properties in ${areaName}`;
}

export function getDeveloperAreaDescription(template: DeveloperAreaTemplate, areaName: string, totalListings?: number) {
  const listingCount = typeof totalListings === 'number' && totalListings > 0 ? ` Browse ${totalListings} available listings` : ' Browse available listings';
  return `${listingCount} by ${template.developerName} in ${areaName}, with prices, property details, Golden Visa signals, and investor-focused buying context.`;
}

export function getBuildingReviewTitle(building: BuildingWithRelations) {
  return `${building.name} Review`;
}

export function getBuildingReviewDescription(building: BuildingWithRelations) {
  const location = [building.area?.name, building.city?.name].filter(Boolean).join(', ');
  const locationText = location ? ` in ${location}` : '';
  return `Review ${building.name}${locationText}, including price per sqft, rental yield, service charges, amenities, nearby places, and investor pros and cons.`;
}

export function getPropertyOffPlanTitle(property: Property) {
  return `${property.title} Off-Plan`;
}

export function getPropertyOffPlanDescription(property: Property) {
  const location = property.city?.name ? ` in ${property.city.name}` : '';
  const developer = property.developer?.name ? ` by ${property.developer.name}` : '';
  return `Explore ${property.title} off-plan property${location}${developer}, including price, bedrooms, size, Golden Visa signal, handover context, and buyer-focused details.`;
}

export function getAreaVsAreaTitle(primaryArea: AreaDetail, secondaryArea: AreaDetail) {
  return `${primaryArea.name} vs ${secondaryArea.name}`;
}

export function getAreaVsAreaDescription(primaryArea: AreaDetail, secondaryArea: AreaDetail) {
  return `Compare ${primaryArea.name} and ${secondaryArea.name} using real area data, available listings, average prices, price per sqft, Golden Visa signals, amenities, and area guide links.`;
}

export function getAreaRentalYieldTitle(area: AreaDetail) {
  return `${area.name} Rental Yield`;
}

export function getAreaRentalYieldDescription(area: AreaDetail) {
  return `Review ${area.name} rental yield using real building-level yield data, available listings, area context, and source building links.`;
}

export function createPropertyTypeAreaFaqs({
  template,
  area,
  category,
  properties,
}: {
  template: PropertyTypeAreaTemplate;
  area: AreaDetail;
  category: Category;
  properties: PropertyListItem[];
}): FAQ[] {
  const title = getPropertyTypeAreaTitle(template, area.name);
  const goldenVisaCount = properties.filter((property) => property.golden_visa_eligible).length;
  const categoryName = category.name || template.propertyTypeLabel.toLowerCase();

  return [
    {
      id: `${template.slug}-availability`,
      question: `Are there ${categoryName.toLowerCase()} for sale in ${area.name}?`,
      answer: `Yes. ${title} shows available listings connected to ${area.name}, including price, bedrooms, bathrooms, size, status, and Golden Visa eligibility where available.`,
    },
    {
      id: `${template.slug}-price`,
      question: `What affects the price of ${categoryName.toLowerCase()} in ${area.name}?`,
      answer: `Prices usually depend on building, view, floor level, unit size, bedroom count, furnishing, handover status, service charges, and current demand in ${area.name}.`,
    },
    {
      id: `${template.slug}-golden-visa`,
      question: `Can ${categoryName.toLowerCase()} in ${area.name} qualify for the UAE Golden Visa?`,
      answer:
        goldenVisaCount > 0
          ? 'Some listings on this page are marked Golden Visa eligible. Eligibility is generally linked to the AED 2M property value threshold and current UAE requirements.'
          : 'Eligibility is generally linked to the AED 2M property value threshold and current UAE requirements. Use the Golden Visa filter to find eligible properties when available.',
    },
    {
      id: `${template.slug}-compare`,
      question: `How should buyers compare ${categoryName.toLowerCase()} in ${area.name}?`,
      answer: 'Compare price per sqft, building quality, developer history, service charge level, rental yield, nearby infrastructure, and exit liquidity before shortlisting a property.',
    },
  ];
}

export function createDeveloperAreaFaqs({ template, area, developer, properties }: { template: DeveloperAreaTemplate; area: AreaDetail; developer: Developer; properties: PropertyListItem[] }): FAQ[] {
  const title = getDeveloperAreaTitle(template, area.name);
  const goldenVisaCount = properties.filter((property) => property.golden_visa_eligible).length;
  const developerDescription = developer.description?.trim();

  return [
    {
      id: `${template.slug}-availability`,
      question: `Are there ${developer.name} properties in ${area.name}?`,
      answer: `Yes. ${title} shows available listings connected to ${area.name}, including price, bedrooms, bathrooms, size, status, and Golden Visa eligibility where available.`,
    },
    {
      id: `${template.slug}-developer`,
      question: `What should buyers know about ${developer.name}?`,
      answer:
        developerDescription ||
        `${developer.name} is listed as the developer for selected Dubai properties. Buyers should compare delivery history, building quality, service charges, amenities, and resale liquidity before shortlisting.`,
    },
    {
      id: `${template.slug}-golden-visa`,
      question: `Can ${developer.name} properties in ${area.name} qualify for the UAE Golden Visa?`,
      answer:
        goldenVisaCount > 0
          ? 'Some listings on this page are marked Golden Visa eligible. Eligibility is generally linked to the AED 2M property value threshold and current UAE requirements.'
          : 'Eligibility is generally linked to the AED 2M property value threshold and current UAE requirements. Use listing-level checks to confirm eligibility before making a decision.',
    },
    {
      id: `${template.slug}-compare`,
      question: `How should buyers compare ${developer.name} properties in ${area.name}?`,
      answer: 'Compare price per sqft, unit size, building age, amenities, service charges, rental yield, nearby infrastructure, and developer reputation before shortlisting a property.',
    },
  ];
}

export function createBuildingReviewFaqs(building: BuildingWithRelations): FAQ[] {
  const areaName = building.area?.name ?? 'this area';
  const yieldText = typeof building.rental_yield === 'number' ? `${building.rental_yield}%` : 'not currently published';
  const serviceChargeText = typeof building.service_charge_aed_per_sqft === 'number' ? `AED ${building.service_charge_aed_per_sqft}/sqft` : 'not currently published';

  return [
    {
      id: `${building.slug}-overview`,
      question: `Is ${building.name} a good building to consider?`,
      answer: `${building.name} should be reviewed against price per sqft, rental yield, service charges, building quality, amenities, nearby infrastructure, and liquidity in ${areaName}.`,
    },
    {
      id: `${building.slug}-yield`,
      question: `What is the rental yield for ${building.name}?`,
      answer: `The rental yield for ${building.name} is ${yieldText}. Buyers should compare this with similar buildings in ${areaName} before shortlisting.`,
    },
    {
      id: `${building.slug}-service-charge`,
      question: `What are the service charges for ${building.name}?`,
      answer: `The service charge figure for ${building.name} is ${serviceChargeText}. Service charges can materially affect net rental returns.`,
    },
    {
      id: `${building.slug}-compare`,
      question: `How should buyers compare ${building.name}?`,
      answer: 'Compare recent transactions, unit layouts, view, floor level, amenities, developer reputation, service charges, and resale liquidity before making a decision.',
    },
  ];
}

export function createPropertyOffPlanFaqs(property: Property): FAQ[] {
  const developerName = property.developer?.name ?? 'the developer';
  const cityName = property.city?.name ?? 'Dubai';

  return [
    {
      id: `${property.slug}-overview`,
      question: `Is ${property.title} an off-plan property?`,
      answer: `Yes. ${property.title} is listed as an off-plan property in ${cityName}, with details such as price, bedrooms, bathrooms, size, features, and Golden Visa eligibility where available.`,
    },
    {
      id: `${property.slug}-developer`,
      question: `Who is the developer of ${property.title}?`,
      answer: `${property.title} is connected to ${developerName}. Buyers should review developer history, payment plan, handover timeline, escrow details, service charge expectations, and resale liquidity before shortlisting.`,
    },
    {
      id: `${property.slug}-golden-visa`,
      question: `Can ${property.title} qualify for the UAE Golden Visa?`,
      answer: property.golden_visa_eligible
        ? `${property.title} is marked Golden Visa eligible. Final eligibility depends on current UAE rules, property value, payment status, and official approval.`
        : 'Golden Visa eligibility usually depends on the AED 2M property value threshold and current UAE requirements. Confirm eligibility before making a purchase decision.',
    },
    {
      id: `${property.slug}-compare`,
      question: `How should buyers compare ${property.title}?`,
      answer:
        'Compare launch price, payment plan, handover timeline, developer reputation, unit size, amenities, location infrastructure, expected rental demand, and resale liquidity before making a decision.',
    },
  ];
}

export function calculatePropertyStats(properties: PropertyListItem[]) {
  const validPrices = properties.filter((property) => property.price_aed > 0);
  const validPricePerSqft = properties.filter((property) => property.price_aed > 0 && property.size_sqft > 0);
  const totalPrice = validPrices.reduce((sum, property) => sum + property.price_aed, 0);
  const totalPricePerSqft = validPricePerSqft.reduce((sum, property) => sum + property.price_aed / property.size_sqft, 0);

  return {
    listingsCount: properties.length,
    goldenVisaCount: properties.filter((property) => property.golden_visa_eligible).length,
    averagePrice: validPrices.length > 0 ? Math.round(totalPrice / validPrices.length) : null,
    averagePricePerSqft: validPricePerSqft.length > 0 ? Math.round(totalPricePerSqft / validPricePerSqft.length) : null,
  };
}
