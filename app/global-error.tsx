'use client';

import { isConfigError } from '@/lib/env';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  const isConfig = isConfigError(error);
  console.error(error);
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            {isConfig ? (
              <>
                <h1 className="text-2xl font-bold">Configuration Error</h1>
                <p className="text-muted-foreground">The application is not properly configured. Please contact the administrator.</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
              </>
            )}

            <button onClick={() => unstable_retry()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
