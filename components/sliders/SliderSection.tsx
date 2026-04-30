'use client';

import React from 'react';
import type { Swiper } from 'swiper';
import { SectionCard } from '@/components/shared/SectionCard';
import { SliderLayout, PropertySlideItem } from './ImageSlider';
import { Button } from '@/components/ui/button';

type SliderSectionProps<T = PropertySlideItem> = {
  title?: string;
  description?: string;
  data: T[];
  SlideComponent?: React.ComponentType<T>;

  autoplay?: boolean;
  delay?: number;
  loop?: boolean;
  showPagination?: boolean;
  spaceBetween?: number;
  slidesPerView?: number;
  breakpoints?: Record<number, { slidesPerView?: number; spaceBetween?: number }>;

  className?: string;
  showNavigation?: boolean;
};

export function SliderSection<T>({
  title,
  description,
  data,
  SlideComponent,

  autoplay = false,
  delay = 5000,
  loop = true,
  showPagination = false,
  spaceBetween = 20,
  slidesPerView = 1,
  breakpoints,

  className = '',
  showNavigation = true,
}: SliderSectionProps<T>) {
  const [swiper, setSwiper] = React.useState<Swiper | null>(null);

  return (
    <SectionCard
      title={title}
      description={description}
      className={className}
      classes={{
        title: 'text-sm! sm:text-2xl! font-normal',
      }}
      navigation={
        showNavigation ? (
          <div className="flex gap-1">
            <Button onClick={() => swiper?.slidePrev()} size="icon" variant="ghost" aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Button>
            <Button onClick={() => swiper?.slideNext()} size="icon" variant="ghost" aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Button>
          </div>
        ) : null
      }
    >
      <SliderLayout
        data={data}
        SlideComponent={SlideComponent}
        autoplay={autoplay}
        delay={delay}
        loop={loop}
        showPagination={showPagination}
        showNavigation={false}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        breakpoints={breakpoints}
        onSwiper={setSwiper}
      />
    </SectionCard>
  );
}
