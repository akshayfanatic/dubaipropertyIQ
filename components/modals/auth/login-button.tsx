'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LoginButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function LoginButton({ label = 'Log in', href = '/auth/login' }: LoginButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'text-secondary font-semibold')}>
      {label}
    </Link>
  );
}
