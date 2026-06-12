import { siteUrl } from '@/lib/utils/seo';
import { staticImages } from '@/config';
import type { Developer } from '@/types/developer';
import type { Property, PropertyFAQ } from '@/types/property';
import type {
  AboutPage,
  AccommodationLeaf,
  BreadcrumbList,
  FAQPage,
  IdReference,
  Offer,
  Organization,
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

export function createFaqPageSchema(faqs: PropertyFAQ[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getSchemaFaqs(faqs).map((faq) => ({
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
