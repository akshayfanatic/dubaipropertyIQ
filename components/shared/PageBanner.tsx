import { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageBannerProps {
  imageUrl?: string;
  children?: ReactNode;
  bottomContent?: ReactNode;
  heightClassName?: string;
  overlayClassName?: string;
  imageClassName?: string;
  bottomContentClassName?: string;
  contentClassName?: string;
  className?: string;
  alt?: string;
}

export function PageBanner({
  imageUrl,
  children,
  bottomContent,
  heightClassName = 'min-h-[500px]',
  overlayClassName = 'bg-black/40',
  imageClassName,
  bottomContentClassName,
  contentClassName = 'container mx-auto px-4 sm:px-6 lg:px-8',
  className,
  alt = 'Banner image',
}: PageBannerProps) {
  const hasImage = Boolean(imageUrl);

  return (
    <section className={cn('relative flex w-full items-center overflow-hidden', heightClassName, !hasImage && 'bg-white', className)}>
      {/* Background Image */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <Image src={imageUrl!} alt={alt} fill priority className={cn('object-cover', imageClassName)} />

          {/* Overlay */}
          <div className={cn('absolute inset-0', overlayClassName)} />
        </div>
      )}

      {/* Content */}
      {children && <div className={cn('relative z-10 w-full', contentClassName)}>{children}</div>}
      {bottomContent && <div className={cn('absolute inset-x-0 bottom-0 z-10', bottomContentClassName)}>{bottomContent}</div>}
    </section>
  );
}
