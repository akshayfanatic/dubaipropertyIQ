import { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageBannerProps {
  imageUrl?: string;
  children?: ReactNode;
  heightClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  className?: string;
  alt?: string;
}

export function PageBanner({
  imageUrl,
  children,
  heightClassName = 'min-h-[500px]',
  overlayClassName = 'bg-black/40',
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
          <Image src={imageUrl!} alt={alt} fill priority className="object-cover" />

          {/* Overlay */}
          <div className={cn('absolute inset-0', overlayClassName)} />
        </div>
      )}

      {/* Content */}
      {children && <div className={cn('relative z-10 w-full', contentClassName)}>{children}</div>}
    </section>
  );
}
