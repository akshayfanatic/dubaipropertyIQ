'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// For navigation with Link (requires href)
export function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="h-6 w-6 stroke-[2.5]" />
    </Link>
  );
}

// For navigation with router.back() (browser history)
export function BackButton() {
  const router = useRouter();
  return <ArrowLeft className="h-6 w-6 cursor-pointer text-muted-foreground transition-colors hover:text-foreground stroke-[2.5]" onClick={() => router.back()} />;
}
