'use client';

import Image from 'next/image';

import SearchForm from '@/components/form/SearchForm';

interface HeroBannerProps {
  badge?: string;
  headline?: string;
  subtext?: string;
  backgroundImage?: string;
}

export default function HeroBanner({
  badge = 'Premium Properties',
  headline = 'Find Your Dream Home',
  subtext = "Discover exceptional properties in Dubai's most prestigious locations. Your perfect home awaits with our curated collection.",
  backgroundImage = '/assets/images/hero-bg.jpg',
}: HeroBannerProps) {
  return (
    <section className="relative min-h-150 w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImage} alt="Dubai skyline" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto flex min-h-150 flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        {/* Badge */}
        <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90">{badge}</span>

        {/* Headline */}
        <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">{headline}</h1>

        {/* Subtext */}
        <p className="mb-8 max-w-2xl text-base text-white/80 md:text-lg">{subtext}</p>

        {/* Search Form */}
        <div className="w-full max-w-4xl rounded-xl bg-white/10 p-4 md:p-6">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
