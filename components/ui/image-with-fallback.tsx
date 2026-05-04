'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
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
  useInitials = false,
  priority = false,
  unoptimized = false,
  fill = false,
  style,
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generic image placeholder SVG
  const svgFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Crect x='20' y='20' width='60' height='60' rx='4' fill='none' stroke='%23d1d5db' stroke-width='2'/%3E%3Ccircle cx='35' cy='40' r='6' fill='%23d1d5db'/%3E%3Cpath d='M20 70 L35 55 L45 65 L55 50 L80 70 Z' fill='%23d1d5db'/%3E%3C/svg%3E`;

  // No source or error - show fallback
  if (!src || imageError) {
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
    return <img src={svgFallback} alt={alt} width={width} height={height} className={cn('object-cover', className)} style={fill ? style : { ...style, width, height }} />;
  }

  // Has source - show image
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn('object-cover', isLoading ? 'opacity-0' : 'opacity-100', className)}
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
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(isLoading ? 'opacity-0' : 'opacity-100', className)}
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
