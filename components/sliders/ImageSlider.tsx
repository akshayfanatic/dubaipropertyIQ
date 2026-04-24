'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useClient } from '@/hooks/use-client';

import 'swiper/css';
import 'swiper/css/pagination';

type Breakpoints = Record<number, { slidesPerView?: number; spaceBetween?: number }>;

export type PropertySlideItem = {
  id: number;
  title: string;
  image: string;
  price: string;
  location?: string;
};

type SliderLayoutProps<T> = {
  data: T[];
  SlideComponent?: React.ComponentType<T>;

  autoplay?: boolean;
  delay?: number;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
  spaceBetween?: number;
  slidesPerView?: number;
  breakpoints?: Breakpoints;
  className?: string;
  onSwiper?: (swiper: SwiperType) => void;
};

export function SliderLayout<T>({
  data,
  SlideComponent,

  autoplay = false,
  delay = 5000,
  loop = true,
  showNavigation = true,
  showPagination = false,
  spaceBetween = 20,
  slidesPerView = 1,
  breakpoints,
  className = '',
  onSwiper,
}: SliderLayoutProps<T>) {
  const isClient = useClient();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  if (!isClient) {
    return null;
  }

  return (
    <div className={className}>
      <div className="relative">
        {showNavigation && (
          <div className="absolute top-0 right-0 z-10 flex gap-1">
            <button
              onClick={() => swiper?.slidePrev()}
              className="w-9 h-9 rounded-full bg-secondary/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              className="w-9 h-9 rounded-full bg-secondary/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
        <Swiper
          modules={[Pagination, Autoplay, A11y]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          loop={loop}
          pagination={showPagination ? { clickable: true } : false}
          autoplay={
            autoplay
              ? {
                  delay,
                  disableOnInteraction: false,
                }
              : false
          }
          breakpoints={breakpoints}
          onSwiper={(s) => {
            setSwiper(s);
            onSwiper?.(s);
          }}
          className="w-full"
        >
          {data.map((item, index) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <SwiperSlide key={index}>{SlideComponent && <SlideComponent {...(item as any)} />}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
