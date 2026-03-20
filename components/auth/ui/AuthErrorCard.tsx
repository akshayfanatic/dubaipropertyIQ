'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, AlertCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const errorMessages: Record<string, { title: string; description: string }> = {
  default: {
    title: 'Authentication Error',
    description: 'Something went wrong during authentication. Please try again.',
  },
  invalid_token: {
    title: 'Invalid Link',
    description: 'This confirmation link is invalid. Please request a new one.',
  },
  expired_token: {
    title: 'Link Expired',
    description: 'This confirmation link has expired. Please request a new one.',
  },
  verification_failed: {
    title: 'Verification Failed',
    description: 'We could not verify your email. The link may have been used already.',
  },
  access_denied: {
    title: 'Access Denied',
    description: 'You denied access to your account. Please try signing in again.',
  },
  no_code: {
    title: 'Missing Authorization',
    description: 'No authorization code was received. Please try again.',
  },
};

export function AuthErrorCard() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'default';
  const error = errorMessages[errorType] || errorMessages.default;

  return (
    <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
      <div className="w-full max-w-md animate-fade-in animate-duration-500">
        {/* Mobile Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 md:hidden animate-fade-in animate-duration-300 animate-delay-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Dubai Property IQ</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center animate-slide-in-from-bottom animate-duration-500 animate-delay-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{error.title}</h2>
          <p className="mt-1.5 text-muted-foreground">{error.description}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5 animate-fade-down animate-once animate-duration-1000 animate-ease-out sm:p-8">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">If you continue to experience issues, please try one of the following:</p>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Request a new confirmation email</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Check your spam or junk folder</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Make sure you&apos;re using the most recent link</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-11 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-11 w-full">
              <Link href="/auth/signup">Create a new account</Link>
            </Button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need help?{' '}
            <Link href="/support" className="underline-offset-2 transition-colors hover:text-foreground hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
