'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
  // Use initials as fallback instead of icon
  useInitials?: boolean;
  // Priority for Next.js Image
  priority?: boolean;
  // Unoptimized for Next.js Image
  unoptimized?: boolean;
  // Fill mode for responsive images
  fill?: boolean;
  // Style object for fill mode
  style?: React.CSSProperties;
}

/**
 * Consistent image fallback component for use across the app.
 * Displays an image with a fallback to icon or initials when loading fails or no src provided.
 */
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

  // No source provided or error occurred - show fallback
  if (!src || imageError) {
    if (useInitials && alt) {
      // Extract initials (first letter of each word, max 2)
      const initials = alt
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0]?.toUpperCase())
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

    return (
      <div
        className={cn('flex items-center justify-center rounded-md bg-muted text-muted-foreground', fill ? 'absolute inset-0' : 'shrink-0', fallbackClassName)}
        style={fill ? style : { ...style, width, height }}
      >
        <ImageIcon className={fill ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-4 w-4'} />
      </div>
    );
  }

  // Has source - show image
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', isLoading ? 'opacity-0' : 'opacity-100', className)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        priority={priority}
        unoptimized={unoptimized}
        style={style}
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
