'use client';

import Image from 'next/image';
import type { ImageObject } from '@/types/images';

type AreaGallerySlideProps = ImageObject & {
  name: string;
};

export function AreaGallerySlide({ url, alt_tag, name }: AreaGallerySlideProps) {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-lg border bg-muted sm:h-[460px]">
      <Image src={url} alt={alt_tag || `${name} community photo`} fill unoptimized className="object-cover" />
    </div>
  );
}
