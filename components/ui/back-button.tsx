'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// For navigation with Link (requires href)
export function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}

// For navigation with router.back() (browser history)
export function BackButton() {
  const router = useRouter();
  return <ArrowLeft className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => router.back()} />;
}
