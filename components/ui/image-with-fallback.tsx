'use client';

import { useState } from 'react';
import Image from 'next/image';
import { staticImages } from '@/config';
import { cn } from '@/lib/utils';

const DEFAULT_FALLBACK_SRC = staticImages.fallback.image;

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
  fallbackSrc?: string;
  useInitials?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function ImageWithFallback({
  src,
  alt,
  width = 32,
  height = 32,
  className,
  fallbackClassName,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  useInitials = false,
  priority = false,
  unoptimized = false,
  fill = false,
  style,
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedSrc = imageError || !src ? fallbackSrc : src;
  const isFallbackImage = resolvedSrc === fallbackSrc;

  // Generic image placeholder SVG
  const svgFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Crect x='20' y='20' width='60' height='60' rx='4' fill='none' stroke='%23d1d5db' stroke-width='2'/%3E%3Ccircle cx='35' cy='40' r='6' fill='%23d1d5db'/%3E%3Cpath d='M20 70 L35 55 L45 65 L55 50 L80 70 Z' fill='%23d1d5db'/%3E%3C/svg%3E`;

  // No source, no fallback image, or image error without fallback - show generic fallback
  if (!resolvedSrc) {
    if (useInitials && alt) {
      const initials = alt
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0]?.toUpperCase())
        .slice(0, 2)
        .join('');
      return (
        <div
          className={cn('flex items-center justify-center rounded-md bg-muted text-muted-foreground font-medium text-xs', fill ? 'absolute inset-0' : 'shrink-0', fallbackClassName)}
          style={fill ? style : { ...style, width, height }}
        >
          <span className={fill ? 'text-sm sm:text-base' : ''}>{initials || '?'}</span>
        </div>
      );
    }
    return <Image src={svgFallback} alt={alt} width={width} height={height} className={cn('object-cover', className)} style={fill ? style : { ...style, width, height }} />;
  }

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(isFallbackImage ? 'object-contain p-10' : 'object-cover', isLoading && !imageError ? 'opacity-0' : 'opacity-100', className)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        priority={priority}
        unoptimized={unoptimized}
        style={style}
        loading="eager"
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(isFallbackImage ? 'object-contain' : undefined, isLoading && !imageError ? 'opacity-0' : 'opacity-100', className)}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setImageError(true);
        setIsLoading(false);
      }}
      priority={priority}
      unoptimized={unoptimized}
    />
  );
}
