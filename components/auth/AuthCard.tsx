'use client';

import { Building2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthCardProps {
  /** Main heading text */
  title: string;
  /** Subtitle/description below the title */
  subtitle: string;
  /** Form content rendered inside the card */
  children: ReactNode;
  /** Optional footer content (e.g., terms links) */
  footer?: ReactNode;
  /** Show mobile logo (default: true) */
  showMobileLogo?: boolean;
}

/**
 * Reusable composition component for authentication forms.
 * Provides consistent UI wrapper for login, signup, forgot-password, and reset-password forms.
 */
export function AuthCard({ title, subtitle, children, footer, showMobileLogo = true }: AuthCardProps) {
  return (
    <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
      <div className="w-full max-w-md animate-fade-in animate-duration-500">
        {/* Mobile Logo */}
        {showMobileLogo && (
          <div className="mb-8 flex items-center justify-center gap-2 md:hidden animate-fade-in animate-duration-300 animate-delay-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Dubai Property IQ</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 animate-slide-in-from-bottom animate-duration-500 animate-delay-100">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1.5 text-muted-foreground">{subtitle}</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5 animate-fade-down animate-once animate-duration-1000 animate-ease-out sm:p-8">{children}</div>

        {/* Footer */}
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
}
