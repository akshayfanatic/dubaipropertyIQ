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

interface PropertyGalleryProps {
  photos: ImageObject[];
  title: string;
  statusLabel: string;
  statusClassName: string;
}

export function PropertyGallery({ photos, title, statusLabel, statusClassName }: PropertyGalleryProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const images = photos?.length ? photos : [{ url: '/assets/images/placeholder.jpg', alt_tag: title }];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setThumbsSwiper(null);
      }}
    >
      {/* Trigger */}
      <DialogTrigger asChild>
        <div className="relative aspect-16/10 md:aspect-21/9 rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
            {/* LARGE MAIN IMAGE */}
            <div className="col-span-3 md:col-span-2 row-span-2 relative h-full overflow-hidden">
              <ImageWithFallback src={images[0]?.url} alt={images[0]?.alt_tag || title} fill priority className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>

            {/* SECONDARY IMAGES (Right side stacked) */}
            <div className="hidden md:block relative h-full overflow-hidden">
              <ImageWithFallback src={images[1]?.url} alt={images[1]?.alt_tag || `${title}-1`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="hidden md:block relative h-full overflow-hidden">
              <ImageWithFallback src={images[2]?.url} alt={images[2]?.alt_tag || `${title}-2`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              {images.length > 3 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">+{images.length - 3}</div>}
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className={cn('px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md bg-white/90 backdrop-blur-sm text-black', statusClassName)}>{statusLabel}</div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />

          {/* View Photos Button */}
          <div className="absolute bottom-6 right-6 z-10">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/95 hover:bg-primary text-foreground hover:text-white text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95 backdrop-blur-md group/btn border border-primary/10">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-primary group-hover/btn:bg-white rounded-[1px] transition-colors" />
                <div className="w-1.5 h-1.5 bg-primary group-hover/btn:bg-white rounded-[1px] transition-colors" />
                <div className="w-1.5 h-1.5 bg-primary group-hover/btn:bg-white rounded-[1px] transition-colors" />
                <div className="w-1.5 h-1.5 bg-primary group-hover/btn:bg-white rounded-[1px] transition-colors" />
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
