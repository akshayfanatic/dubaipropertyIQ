import type { Metadata } from 'next';
import type { Property } from '@/types';

export function createPropertyMetadata(property: Property): Metadata {
  const seo = property.properties_seo;
  const firstImage = property.photos?.[0]?.url;
  const title = seo?.meta_title || `${property.title} | DubaiPropertyIQ`;
  const description = seo?.meta_description || property.description;
  const image = seo?.og_image_url || firstImage;
  const keywords = seo?.keywords
    ?.split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: seo?.canonical_url
      ? {
          canonical: seo.canonical_url,
        }
      : undefined,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
  };
}
