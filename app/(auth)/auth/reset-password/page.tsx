import { Suspense } from 'react';
import { AuthBrandingPanel } from '@/components/auth/AuthBrandingPanel';
import { ResetPasswordClient } from './ResetPasswordClient';

function ResetPasswordFallback() {
  return (
    <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-lg shadow-black/5">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
          <p className="mt-4 text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default async function ResetPasswordPage() {
  return (
    <>
      <AuthBrandingPanel />
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordClient />
      </Suspense>
    </>
  );
}
