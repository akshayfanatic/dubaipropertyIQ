import type { Metadata } from 'next';
import type { Property } from '@/types';

const cleanText = (value?: string | null) => value?.trim() || undefined;
const siteName = 'Dubai Property IQ';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dubaipropertyiq.com';

export const metadataBase = new URL(siteUrl);

export const defaultOpenGraphImage = '/assets/images/hero-bg-2.jpg';

export function splitKeywords(value?: string | null) {
  return cleanText(value)
    ?.split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  image = defaultOpenGraphImage,
  imageAlt,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[] | string | null;
  image?: string | null;
  imageAlt?: string;
  type?: 'website' | 'article';
}): Metadata {
  const keywordList = Array.isArray(keywords) ? keywords : splitKeywords(keywords);

  return {
    metadataBase,
    title: {
      absolute: title,
    },
    description,
    keywords: keywordList?.length ? keywordList : undefined,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      images: image ? [{ url: image, alt: imageAlt || title }] : undefined,
      type,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export function createPropertyMetadata(property: Property): Metadata {
  const seo = property.properties_seo;
  const firstImage = property.photos?.[0]?.url;
  const title = cleanText(seo?.meta_title) || `${property.title} | ${siteName}`;
  const description = cleanText(seo?.meta_description) || cleanText(property.description);
  const image = cleanText(seo?.og_image_url) || firstImage;
  const canonical = cleanText(seo?.canonical_url) || `/properties/${property.slug}`;
  const keywords = splitKeywords(seo?.keywords);

  return {
    metadataBase,
    title: {
      absolute: title,
    },
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
