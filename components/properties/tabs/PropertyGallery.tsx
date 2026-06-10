'use client';
import { useRef, useState } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { ImageObject } from '@/types/images';
import { cn } from '@/lib/utils';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';
import { staticImages } from '@/config';

interface PropertyGalleryProps {
  photos: ImageObject[];
  title: string;
  statusLabel: string;
  statusClassName: string;
  golden_visa_eligible?: boolean;
}

export function PropertyGallery({ photos, title, statusLabel, statusClassName, golden_visa_eligible }: PropertyGalleryProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const images = photos?.length ? photos : [{ url: staticImages.fallback.property, alt_tag: title }];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setThumbsSwiper(null);
      }}
    >
      {/* Trigger */}
      <DialogTrigger asChild>
        <div className="group relative aspect-16/10 cursor-pointer overflow-hidden rounded-[22px] border border-border bg-card p-2 shadow-[0_24px_60px_oklch(0.18_0.05_260.47_/_0.18)] md:aspect-21/9">
          <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
            {/* LARGE MAIN IMAGE */}
            <div className="relative col-span-3 row-span-2 h-full overflow-hidden rounded-2xl md:col-span-2">
              <ImageWithFallback
                src={images[0]?.url}
                alt={images[0]?.alt_tag || title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.035]"
              />
            </div>

            {/* SECONDARY IMAGES (Right side stacked) */}
            <div className="relative hidden h-full overflow-hidden rounded-2xl md:block">
              <ImageWithFallback src={images[1]?.url} alt={images[1]?.alt_tag || `${title}-1`} fill className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.035]" />
            </div>
            <div className="relative hidden h-full overflow-hidden rounded-2xl md:block">
              <ImageWithFallback src={images[2]?.url} alt={images[2]?.alt_tag || `${title}-2`} fill className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.035]" />
              {images.length > 3 && <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 text-lg font-bold text-primary-foreground">+{images.length - 3}</div>}
            </div>
          </div>

          {/* Status & Golden Visa Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className={cn('px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md bg-white/90 backdrop-blur-sm text-black', statusClassName)}>{statusLabel}</div>
            {golden_visa_eligible && <GoldenVisaBadge variant="gradient-soft" className="px-3 py-1.5 text-sm shadow-xl backdrop-blur-md" />}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/5 transition-colors duration-300 group-hover:bg-foreground/10" />

          {/* View Photos Button */}
          <div className="absolute bottom-5 right-5 z-10">
            <button className="group/btn flex min-h-11 items-center gap-2 rounded-xl border border-primary-foreground/35 bg-background/95 px-4 text-sm font-extrabold text-foreground shadow-[0_14px_34px_oklch(0.2_0.03_263.61_/_0.12)] backdrop-blur-md transition-[transform,background-color,color] duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground active:translate-y-0">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1.5 w-1.5 rounded-[1px] bg-primary transition-colors group-hover/btn:bg-primary-foreground" />
                <div className="h-1.5 w-1.5 rounded-[1px] bg-primary transition-colors group-hover/btn:bg-primary-foreground" />
                <div className="h-1.5 w-1.5 rounded-[1px] bg-primary transition-colors group-hover/btn:bg-primary-foreground" />
                <div className="h-1.5 w-1.5 rounded-[1px] bg-primary transition-colors group-hover/btn:bg-primary-foreground" />
              </div>
              Show all photos
            </button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="sm:max-w-7xl max-w-full w-screen h-[90vh] p-0 flex flex-col overflow-hidden bg-white/80 backdrop-blur-2xl border-none shadow-2xl">
        <DialogTitle className="sr-only">Gallery</DialogTitle>
        <DialogDescription className="sr-only">Image gallery viewer</DialogDescription>

        <div className="absolute top-4 right-4 z-50">
          <DialogClose className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 shadow-primary/20">
            <X size={20} />
          </DialogClose>
        </div>

        {/* MAIN SWIPER */}
        <div className="relative flex-1 overflow-hidden group/nav">
          <Swiper
            modules={[Navigation, Pagination, Thumbs]}
            navigation={{
              nextEl: '.swiper-button-next-gallery',
              prevEl: '.swiper-button-prev-gallery',
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            pagination={{ type: 'fraction' }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="w-full h-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={img.url || idx}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <ImageWithFallback src={img.url} alt={img.alt_tag || `${title}-${idx}`} fill priority={idx === 0} className="object-contain select-none" />
                </div>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-20 flex items-center justify-between px-4 sm:px-8">
              <button className="swiper-button-prev-gallery pointer-events-auto w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none -translate-x-4 group-hover/nav:translate-x-0 shadow-lg shadow-primary/20 hover:scale-110 active:scale-90">
                <ChevronLeft size={24} />
              </button>
              <button className="swiper-button-next-gallery pointer-events-auto w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none translate-x-4 group-hover/nav:translate-x-0 shadow-lg shadow-primary/20 hover:scale-110 active:scale-90">
                <ChevronRight size={24} />
              </button>
            </div>
          </Swiper>
        </div>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="h-24 px-4 py-4">
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              breakpoints={{
                640: { slidesPerView: 6 },
                1024: { slidesPerView: 8 },
              }}
              spaceBetween={12}
              className="h-full thumbs-swiper"
            >
              {images.map((img, index) => (
                <SwiperSlide key={img.url || index}>
                  <div className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer border-2 border-transparent transition-all [.swiper-slide-thumb-active_&]:border-primary [.swiper-slide-thumb-active_&]:opacity-100 opacity-50 hover:opacity-100">
                    <ImageWithFallback src={img.url} alt={img.alt_tag || `${title}-${index}`} fill className="object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
