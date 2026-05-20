'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typewriter } from '@/components/shared/Typewriter';
import { AreaGallerySlide } from '@/components/areas/AreaGallerySlide';
import type { ImageObject } from '@/types/images';

import 'swiper/css';
import 'swiper/css/pagination';

type AreaGallerySectionProps = {
  eyebrow: string;
  typewriterText: string;
  description: string;
  imageAltPrefix: string;
  photos: ImageObject[];
};

type GalleryNavigationProps = {
  swiper: SwiperType | null;
};

function GalleryNavigation({ swiper }: GalleryNavigationProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => swiper?.slidePrev()}
        size="icon"
        variant="outline"
        aria-label="Previous photo"
        className="h-10 w-10 rounded-full border-border bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => swiper?.slideNext()}
        size="icon"
        variant="outline"
        aria-label="Next photo"
        className="h-10 w-10 rounded-full border-border bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

function GalleryIntro({ eyebrow, typewriterText, description, photoCount }: Pick<AreaGallerySectionProps, 'eyebrow' | 'typewriterText' | 'description'> & { photoCount: number }) {
  return (
    <div className="max-w-xl space-y-5">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          <Typewriter loop text={typewriterText} speed={100} />
        </h2>
      </div>
      <p className="text-base leading-8 text-muted-foreground">{description}</p>
      <Badge variant="outline" className="px-3 py-1.5">
        {photoCount} Photos
      </Badge>
    </div>
  );
}

function GallerySlider({
  swiper,
  imageAltPrefix,
  photos,
  hasMultiplePhotos,
  onSwiper,
}: Pick<AreaGallerySectionProps, 'imageAltPrefix' | 'photos'> & { swiper: SwiperType | null; hasMultiplePhotos: boolean; onSwiper: (swiper: SwiperType) => void }) {
  return (
    <div className="relative h-90 sm:h-115">
      {hasMultiplePhotos && (
        <div className="absolute right-3 top-3 z-10">
          <GalleryNavigation swiper={swiper} />
        </div>
      )}

      <Swiper
        modules={[Pagination, Autoplay, A11y]}
        direction="vertical"
        slidesPerView={1}
        spaceBetween={16}
        loop={hasMultiplePhotos}
        pagination={{ clickable: true }}
        autoplay={hasMultiplePhotos ? { delay: 4000, disableOnInteraction: false } : false}
        onSwiper={onSwiper}
        className="h-full w-full"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.url}>
            <AreaGallerySlide {...photo} name={imageAltPrefix} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function AreaGallerySection({ eyebrow, typewriterText, description, imageAltPrefix, photos }: AreaGallerySectionProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const hasMultiplePhotos = photos.length > 1;

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <GalleryIntro eyebrow={eyebrow} typewriterText={typewriterText} description={description} photoCount={photos.length} />
      <GallerySlider swiper={swiper} imageAltPrefix={imageAltPrefix} photos={photos} hasMultiplePhotos={hasMultiplePhotos} onSwiper={setSwiper} />
    </div>
  );
}
