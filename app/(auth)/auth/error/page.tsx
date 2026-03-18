import { Suspense } from 'react';
import { AuthBrandingPanel } from '@/components/auth/AuthBrandingPanel';
import { AuthErrorCard } from '@/components/auth/AuthErrorCard';

export default function AuthErrorPage() {
  return (
    <>
      <AuthBrandingPanel />
      <Suspense
        fallback={
          <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <AuthErrorCard />
      </Suspense>
    </>
  );
}
