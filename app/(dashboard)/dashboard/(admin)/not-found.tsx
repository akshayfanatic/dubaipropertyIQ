'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminNotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

        {/* Back Button */}
        <Link href="/dashboard/admin">
          <Button className="cursor-pointer">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
