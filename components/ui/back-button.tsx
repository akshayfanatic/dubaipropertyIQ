'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type BackArrowProps = {
  className?: string;
  iconSize?: number;
  iconClassName?: string;
};

// For navigation with Link (requires href)
type BacklinkProps = BackArrowProps & {
  href: string;
};

export function BackLink({ href, className, iconSize = 24, iconClassName }: BacklinkProps) {
  return (
    <Link href={href} className={cn('inline-flex text-muted-foreground transition-colors hover:text-foreground', className)}>
      <ArrowLeft size={iconSize} className={cn('stroke-[2.5]', iconClassName)} />
    </Link>
  );
}

// For navigation with router.back() (browser history)
type BackButtonProps = BackArrowProps;

export function BackButton({ className, iconSize = 24, iconClassName }: BackButtonProps) {
  const router = useRouter();

  return (
    <button type="button" aria-label="Go back" className={cn('inline-flex cursor-pointer text-muted-foreground transition-colors hover:text-foreground', className)} onClick={() => router.back()}>
      <ArrowLeft size={iconSize} className={cn('stroke-[2.5]', iconClassName)} />
    </button>
  );
}
