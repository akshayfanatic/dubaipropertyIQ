import type { Metadata } from 'next';
import type { Property } from '@/types';

const cleanText = (value?: string | null) => value?.trim() || undefined;

export function createPropertyMetadata(property: Property): Metadata {
  const seo = property.properties_seo;
  const firstImage = property.photos?.[0]?.url;
  const title = cleanText(seo?.meta_title) || `${property.title} | DubaiPropertyIQ`;
  const description = cleanText(seo?.meta_description) || cleanText(property.description);
  const image = cleanText(seo?.og_image_url) || firstImage;
  const canonical = cleanText(seo?.canonical_url);
  const keywords = cleanText(seo?.keywords)
    ?.split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
