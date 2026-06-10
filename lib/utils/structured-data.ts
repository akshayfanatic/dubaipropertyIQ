import { siteUrl } from '@/lib/utils/seo';
import { staticImages } from '@/config';
import type { JsonLdObject } from '@/components/shared/JsonLd';
import type { Property, PropertyFAQ } from '@/types/property';

const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

export const organizationId = `${normalizedSiteUrl}/#organization`;
export const websiteId = `${normalizedSiteUrl}/#website`;

function absoluteUrl(path: string) {
  return new URL(path, normalizedSiteUrl).toString();
}

function hasText(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function createOrganizationSchema(): JsonLdObject {
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

export function createWebsiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'Dubai Property IQ',
    url: normalizedSiteUrl,
    publisher: {
      '@id': organizationId,
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLdObject {
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

export function createWebPageSchema({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): JsonLdObject {
  const url = absoluteUrl(path);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: {
      '@id': websiteId,
    },
    publisher: {
      '@id': organizationId,
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

export function createAboutPageSchema({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): JsonLdObject {
  const url = absoluteUrl(path);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#about`,
    name: title,
    description,
    url,
    isPartOf: {
      '@id': websiteId,
    },
    publisher: {
      '@id': organizationId,
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

export function createFaqPageSchema(faqs: PropertyFAQ[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .filter((faq) => hasText(faq.question) && hasText(faq.answer))
      .map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
  };
}

export function createPropertyDetailSchema(property: Property): JsonLdObject {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const images =
    property.photos
      ?.map((photo) => photo.url)
      .filter(hasText)
      .map(absoluteUrl) ?? [];
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    '@id': `${url}#property`,
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
    offers: {
      '@type': 'Offer',
      price: property.price_aed,
      priceCurrency: 'AED',
      availability: property.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url,
    },
    provider: {
      '@id': organizationId,
    },
  };

  if (images.length > 0) {
    schema.image = images;
  }

  if (property.location) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: property.location.lat,
      longitude: property.location.lng,
    };
  }

  if (property.developer?.name) {
    const brand: JsonLdObject = {
      '@type': 'Organization',
      name: property.developer.name,
    };

    if (hasText(property.developer.website_url)) {
      brand.url = property.developer.website_url;
    }

    schema.brand = brand;
  }

  return schema;
}

export function createCalculatorSchema({ name, description, path }: { name: string; description: string; path: string }): JsonLdObject {
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
    publisher: {
      '@id': organizationId,
    },
  };
}
