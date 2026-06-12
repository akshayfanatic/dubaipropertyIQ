import { siteUrl } from '@/lib/utils/seo';
import { staticImages } from '@/config';
import type { AreaDetail } from '@/lib/db/areas/queries';
import type { BuildingWithRelations } from '@/types/building';
import type { City as CityType } from '@/types/city';
import type { Developer } from '@/types/developer';
import type { FAQ } from '@/types/shared';
import type { Property, PropertyFAQ } from '@/types/property';
import type {
  AboutPage,
  AccommodationLeaf,
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  IdReference,
  ItemList,
  Offer,
  Organization,
  Place,
  RealEstateAgent,
  RealEstateListing,
  WebApplication,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

export const organizationId = `${normalizedSiteUrl}/#organization`;
export const websiteId = `${normalizedSiteUrl}/#website`;

function absoluteUrl(path: string) {
  return new URL(path, normalizedSiteUrl).toString();
}

function hasText(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function organizationReference(): IdReference {
  return {
    '@id': organizationId,
  };
}

function websiteReference(): IdReference {
  return {
    '@id': websiteId,
  };
}

function createDeveloperOrganization(property: Property): Organization | IdReference {
  if (!property.developer?.name) {
    return organizationReference();
  }

  const developer: Organization = {
    '@type': 'Organization',
    name: property.developer.name,
  };

  if (hasText(property.developer.website_url)) {
    developer.url = property.developer.website_url;
  }

  return developer;
}

function getDeveloperLogoUrl(developer: Developer) {
  const logo = developer.logo_url;

  if (typeof logo === 'string') {
    return hasText(logo) ? logo : undefined;
  }

  return hasText(logo?.url) ? logo.url : undefined;
}

function getImageUrl(image: unknown): string | undefined {
  if (typeof image === 'string') {
    return hasText(image) ? image : undefined;
  }

  if (!image || typeof image !== 'object' || Array.isArray(image)) {
    return undefined;
  }

  const candidate = image as { url?: unknown };
  return hasText(candidate.url as string | null | undefined) ? (candidate.url as string) : undefined;
}

export function createOrganizationSchema(): WithContext<RealEstateAgent> {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': organizationId,
    name: 'Dubai Property IQ',
    url: normalizedSiteUrl,
    logo: absoluteUrl(staticImages.brand.logo),
    areaServed: {
      '@type': 'City',
      name: 'Dubai',
    },
  };
}

export function createWebsiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'Dubai Property IQ',
    url: normalizedSiteUrl,
    publisher: organizationReference(),
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createWebPageSchema({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): WithContext<WebPage> {
  const url = absoluteUrl(path);

  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: websiteReference(),
    publisher: organizationReference(),
  };

  if (!image) {
    return schema;
  }

  return {
    ...schema,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(image),
    },
  };
}

export function createAboutPageSchema({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): WithContext<AboutPage> {
  const url = absoluteUrl(path);

  const schema: WithContext<AboutPage> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#about`,
    name: title,
    description,
    url,
    isPartOf: websiteReference(),
    publisher: organizationReference(),
  };

  if (!image) {
    return schema;
  }

  return {
    ...schema,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(image),
    },
  };
}

export function createDeveloperOrganizationSchema(developer: Developer): WithContext<Organization> {
  const pageUrl = absoluteUrl(`/developers/${developer.slug}`);
  const logoUrl = getDeveloperLogoUrl(developer);

  const schema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${pageUrl}#organization`,
    name: developer.name,
    url: hasText(developer.website_url) ? developer.website_url : pageUrl,
  };

  if (hasText(developer.description)) {
    schema.description = developer.description;
  }

  if (logoUrl) {
    schema.logo = absoluteUrl(logoUrl);
  }

  if (hasText(developer.website_url)) {
    schema.sameAs = [developer.website_url];
  }

  return schema;
}

export function createDeveloperWebPageSchema(developer: Developer): WithContext<WebPage> {
  const path = `/developers/${developer.slug}`;
  const pageUrl = absoluteUrl(path);
  const description = developer.developers_seo?.meta_description || developer.description || `Browse Dubai properties and projects by ${developer.name}.`;
  const logoUrl = developer.developers_seo?.og_image_url || getDeveloperLogoUrl(developer);

  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    name: developer.developers_seo?.meta_title || `${developer.name} Properties & Projects in Dubai`,
    description,
    url: pageUrl,
    isPartOf: websiteReference(),
    publisher: organizationReference(),
    mainEntity: {
      '@id': `${pageUrl}#organization`,
    },
  };

  if (!logoUrl) {
    return schema;
  }

  return {
    ...schema,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(logoUrl),
    },
  };
}

export function createCityAreasCollectionSchema(city: CityType, areas: Array<{ name: string; slug: string }>): WithContext<CollectionPage> {
  const path = `/areas/${city.slug}`;
  const url = absoluteUrl(path);
  const description = city.cities_seo?.meta_description || city.description || `Explore communities, areas, and available properties in ${city.name}.`;
  const image = getImageUrl(city.cities_seo?.og_image_url || city.logo_url);
  const itemList: ItemList = {
    '@type': 'ItemList',
    itemListElement: areas.map((area, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: area.name,
      url: absoluteUrl(`${path}/${area.slug}`),
    })),
  };

  const schema: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    name: city.cities_seo?.meta_title || `${city.name} Areas & Communities`,
    description,
    url,
    isPartOf: websiteReference(),
    publisher: organizationReference(),
    mainEntity: itemList,
  };

  if (!image) {
    return schema;
  }

  return {
    ...schema,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(image),
    },
  };
}

export function createAreaPlaceSchema(area: AreaDetail): WithContext<Place> {
  const citySlug = area.city?.slug ?? 'dubai';
  const url = absoluteUrl(`/areas/${citySlug}/${area.slug}`);
  const image = getImageUrl(area.areas_seo?.og_image_url || area.photos[0]);

  const schema: WithContext<Place> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${url}#place`,
    name: area.name,
    url,
  };

  if (hasText(area.description)) {
    schema.description = area.description;
  }

  if (area.city?.name) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: area.city.name,
      addressCountry: 'AE',
    };
  }

  if (area.location) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: area.location.lat,
      longitude: area.location.lng,
    };
  }

  if (image) {
    schema.image = absoluteUrl(image);
  }

  return schema;
}

export function createAreaWebPageSchema(area: AreaDetail): WithContext<WebPage> {
  const citySlug = area.city?.slug ?? 'dubai';
  const path = `/areas/${citySlug}/${area.slug}`;
  const url = absoluteUrl(path);
  const description = area.areas_seo?.meta_description || area.description || `Explore ${area.name} area information, amenities, FAQs, and available properties.`;
  const image = getImageUrl(area.areas_seo?.og_image_url || area.photos[0]);

  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: area.areas_seo?.meta_title || `${area.name}, ${area.city?.name ?? 'UAE'} Properties`,
    description,
    url,
    isPartOf: websiteReference(),
    publisher: organizationReference(),
    mainEntity: {
      '@id': `${url}#place`,
    },
  };

  if (!image) {
    return schema;
  }

  return {
    ...schema,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(image),
    },
  };
}

export function createBuildingAccommodationSchema(building: BuildingWithRelations): WithContext<AccommodationLeaf> {
  const citySlug = building.city?.slug ?? 'dubai';
  const areaSlug = building.area?.slug ?? 'area';
  const url = absoluteUrl(`/areas/${citySlug}/${areaSlug}/${building.slug}`);
  const images = building.photos
    .map((photo) => photo.url)
    .filter(hasText)
    .map(absoluteUrl);

  const schema: WithContext<AccommodationLeaf> = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    '@id': `${url}#accommodation`,
    name: building.name,
    url,
  };

  if (hasText(building.description)) {
    schema.description = building.description;
  }

  if (images.length > 0) {
    schema.image = images;
  }

  if (building.location) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: building.location.lat,
      longitude: building.location.lng,
    };
  }

  return schema;
}

export function createBuildingWebPageSchema(building: BuildingWithRelations): WithContext<WebPage> {
  const citySlug = building.city?.slug ?? 'dubai';
  const areaSlug = building.area?.slug ?? 'area';
  const path = `/areas/${citySlug}/${areaSlug}/${building.slug}`;
  const url = absoluteUrl(path);
  const description = building.buildings_seo?.meta_description || building.description || `Review ${building.name} pricing, yields, amenities, and investment context.`;
  const image = getImageUrl(building.buildings_seo?.og_image_url || building.photos[0]);

  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: building.buildings_seo?.meta_title || `${building.name}, ${building.area?.name ?? 'UAE'} Building Report`,
    description,
    url,
    isPartOf: websiteReference(),
    publisher: organizationReference(),
    mainEntity: {
      '@id': `${url}#accommodation`,
    },
  };

  if (!image) {
    return schema;
  }

  return {
    ...schema,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(image),
    },
  };
}

export function createFaqPageSchema(faqs: FAQ[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getFaqSchemaItems(faqs).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getSchemaFaqs(faqs: PropertyFAQ[] = []) {
  return faqs.filter((faq) => hasText(faq.question) && hasText(faq.answer));
}

export function getFaqSchemaItems(faqs: FAQ[] = []) {
  return faqs.filter((faq) => hasText(faq.question) && hasText(faq.answer));
}

export function createPropertyDetailSchema(property: Property): WithContext<RealEstateListing> {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const accommodationId = `${url}#accommodation`;
  const images =
    property.photos
      ?.map((photo) => photo.url)
      .filter(hasText)
      .map(absoluteUrl) ?? [];

  const accommodation: AccommodationLeaf = {
    '@type': 'Accommodation',
    '@id': accommodationId,
    name: property.title,
    description: property.description,
    url,
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.size_sqft,
      unitCode: 'FTK',
    },
  };

  if (images.length > 0) {
    accommodation.image = images;
  }

  if (property.location) {
    accommodation.geo = {
      '@type': 'GeoCoordinates',
      latitude: property.location.lat,
      longitude: property.location.lng,
    };
  }

  const offer: Offer = {
    '@type': 'Offer',
    '@id': `${url}#offer`,
    price: property.price_aed,
    priceCurrency: 'AED',
    availability: property.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    url,
    itemOffered: {
      '@id': accommodationId,
    },
    offeredBy: createDeveloperOrganization(property),
    seller: organizationReference(),
  };

  const listing: WithContext<RealEstateListing> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: property.title,
    description: property.description,
    url,
    isPartOf: websiteReference(),
    about: accommodation,
    mainEntity: offer,
    publisher: organizationReference(),
  };

  if (property.created_at) {
    listing.datePosted = property.created_at;
  }

  return listing;
}

export function createCalculatorSchema({ name, description, path }: { name: string; description: string; path: string }): WithContext<WebApplication> {
  const url = absoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#calculator`,
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
    publisher: organizationReference(),
  };
}
