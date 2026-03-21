'use client';

import Link from 'next/link';

interface LoginButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function LoginButton({ label = 'Log in', href = '/auth/login', className }: LoginButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className ?? ''}`}
    >
      {label}
    </Link>
  );
}
