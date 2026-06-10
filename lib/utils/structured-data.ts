import { siteUrl } from '@/lib/utils/seo';
import { staticImages } from '@/config';
import type { JsonLdObject } from '@/components/shared/JsonLd';

const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

export const organizationId = `${normalizedSiteUrl}/#organization`;
export const websiteId = `${normalizedSiteUrl}/#website`;

function absoluteUrl(path: string) {
  return new URL(path, normalizedSiteUrl).toString();
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
