'use client';

import Image from 'next/image';
import { Typewriter } from '../shared/Typewriter';

interface HeroBannerProps {
  badge?: string;
  headline: string;
  subtext: string;
  backgroundImage?: string;
  children: React.ReactNode;
}

export default function HeroBanner({ badge, headline, subtext, backgroundImage, children }: HeroBannerProps) {
  return (
    <section className="relative min-h-150 w-full overflow-hidden">
      {/* Background Image with slow zoom animation */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundImage} alt="Dubai skyline" fill className="object-cover animate-in zoom-in-105 animate-duration-[20s] animation-ease-out fill-mode-forwards" priority />
          <div className="absolute inset-0 bg-black/50 animate-in fade-in animation-duration-1000" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-150 flex-col items-center justify-center px-4 py-16 text-center lg:px-8 bg-white">
        {/* Badge - slide in from top */}
        {badge && (
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 animate-in slide-in-from-top-4 fade-in animation-duration-700 animation-ease-out">
            {badge}
          </span>
        )}

        {/* Headline - fade in with slide up */}
        <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl animate-in slide-in-from-bottom-8 fade-in animation-duration-1000 delay-200 animation-ease-out fill-mode-both">
          <Typewriter speed={200} loop text={headline} />
          {/* {headline} */}
        </h1>

        {/* Subtext - fade in with delay */}
        <p className="mb-8 max-w-2xl text-base text-gray-500 md:text-lg animate-in slide-in-from-bottom-6 fade-in animation-duration-1000 delay-300 animation-ease-out fill-mode-both">{subtext}</p>

        {/* Children (Form) - fade in with longer delay - FULL WIDTH */}
        <div className="w-full animate-in slide-in-from-bottom-4 fade-in animation-duration-1000 delay-500 animation-ease-out fill-mode-both">{children}</div>
      </div>
    </section>
  );
}
