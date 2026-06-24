import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, BadgeCheck, Building2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnerOnboardingShellProps {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  points?: string[];
  mediaTitle?: string;
  mediaDescription?: string;
  mediaFeatures?: readonly {
    title: string;
    description: string;
  }[];
  children: ReactNode;
  contentClassName?: string;
  backHref?: string;
  backLabel?: string;
  fullWidth?: boolean;
  quietMedia?: boolean;
  hideMediaImage?: boolean;
  hideMediaContent?: boolean;
}

export function PartnerOnboardingShell({
  eyebrow,
  title,
  description,
  imageSrc = '/assets/images/developer-form.webp',
  imageAlt = 'Dubai skyline and property advisory workspace',
  points = [],
  mediaTitle,
  mediaDescription,
  mediaFeatures,
  children,
  contentClassName,
  backHref = '/customer',
  backLabel = 'Back to account',
  fullWidth = false,
  quietMedia = false,
  hideMediaImage = false,
  hideMediaContent = false,
}: PartnerOnboardingShellProps) {
  const panelFeatures =
    mediaFeatures ??
    points.map((point) => ({
      title: point,
      description: '',
    }));
  const panelIcons = [BadgeCheck, ShieldCheck, Building2];
  const fullWidthMinHeight = 'min-h-[calc(100vh-4.625rem)]';

  return (
    <main className={cn('overflow-x-hidden', fullWidth ? cn(fullWidthMinHeight, 'bg-background p-0') : 'min-h-screen bg-muted/35 p-3 sm:p-5 lg:p-6')}>
      <div
        className={cn(
          'mx-auto grid overflow-hidden bg-card animate-in fade-in duration-500 motion-reduce:animate-none',
          fullWidth
            ? cn(fullWidthMinHeight, 'w-full lg:grid-cols-2')
            : 'min-h-[calc(100vh-1.5rem)] max-w-7xl rounded-2xl border shadow-xl shadow-foreground/10 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[0.88fr_1.12fr]',
        )}
      >
        <section className="relative hidden overflow-hidden lg:block">
          {!hideMediaImage && <Image src={imageSrc} alt={imageAlt} fill priority sizes="50vw" className="object-cover animate-hero-kenburns motion-reduce:animate-none" />}
          <div
            className={cn(
              'absolute inset-0',
              hideMediaContent ? 'bg-foreground/10' : hideMediaImage ? 'bg-auth-brand-bg' : quietMedia ? 'bg-gradient-to-b from-foreground/35 via-foreground/15 to-foreground/45' : 'bg-foreground/64',
            )}
          />
          {quietMedia && !hideMediaContent && (
            <div className="absolute inset-0">
              <div className="absolute -left-20 -top-20 h-80 w-80 animate-pulse rounded-full bg-primary/18 blur-3xl [animation-duration:8s] motion-reduce:animate-none" />
              <div className="absolute -bottom-20 right-0 h-96 w-96 animate-pulse rounded-full bg-primary/12 blur-3xl [animation-duration:10s] motion-reduce:animate-none" />
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-background/70 blur-3xl [animation-duration:12s] motion-reduce:animate-none" />
            </div>
          )}
          {hideMediaImage && (
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(oklch(0.48 0.2 260.47 / 0.4) 1px, transparent 1px),
                                 linear-gradient(90deg, oklch(0.48 0.2 260.47 / 0.4) 1px, transparent 1px)`,
                backgroundSize: '56px 56px',
              }}
            />
          )}

          {!hideMediaContent && (
            <div
              className={cn('relative z-10 flex min-h-full flex-col p-10 xl:p-12', hideMediaImage ? 'text-foreground' : 'text-primary-foreground', quietMedia ? 'justify-start' : 'justify-between')}
            >
              {!(fullWidth && hideMediaImage) && (
                <Link
                  href="/"
                  className={cn(
                    'inline-flex min-h-11 w-fit items-center gap-3 rounded-md pr-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    hideMediaImage
                      ? 'text-foreground/90 hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-auth-brand-bg'
                      : 'text-primary-foreground/90 hover:text-primary-foreground focus-visible:ring-primary-foreground/70 focus-visible:ring-offset-foreground',
                  )}
                >
                  <span className={cn('flex h-9 w-9 items-center justify-center rounded-md', hideMediaImage ? 'bg-primary/10 text-primary' : 'bg-primary-foreground/15')}>
                    <Building2 className="h-4 w-4" />
                  </span>
                  Dubai Property IQ
                </Link>
              )}

              <div
                className={cn(
                  'max-w-xl space-y-6',
                  quietMedia && 'mx-auto flex flex-1 flex-col justify-center animate-fade-up animate-duration-700 animate-ease-out motion-reduce:animate-none',
                  hideMediaImage && 'w-full max-w-md',
                )}
              >
                <div
                  className={cn(
                    'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium',
                    quietMedia && 'animate-slide-in-from-left animate-duration-500 animate-ease-out motion-reduce:animate-none',
                    hideMediaImage ? 'border-primary/15 bg-primary/10 text-primary' : 'border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/90',
                  )}
                  style={quietMedia ? { animationDelay: '80ms', animationFillMode: 'backwards' } : undefined}
                >
                  <BadgeCheck className="h-4 w-4" />
                  {eyebrow}
                </div>
                <div
                  className={cn('space-y-4', hideMediaImage && 'animate-slide-in-from-left animate-duration-700 animate-ease-out motion-reduce:animate-none')}
                  style={hideMediaImage ? { animationDelay: '180ms', animationFillMode: 'backwards' } : undefined}
                >
                  {(!quietMedia || hideMediaImage) && (
                    <h1 className={cn('font-semibold leading-tight tracking-normal', hideMediaImage ? 'text-3xl text-foreground xl:text-4xl' : 'text-4xl xl:text-5xl')}>{mediaTitle ?? title}</h1>
                  )}
                  {(!quietMedia || hideMediaImage) && (
                    <p className={cn('max-w-lg text-base leading-7', hideMediaImage ? 'text-muted-foreground' : 'text-primary-foreground/80')}>{mediaDescription ?? description}</p>
                  )}
                </div>

                {panelFeatures.length > 0 && (
                  <div className="grid gap-3">
                    {panelFeatures.map((feature, index) => {
                      const FeatureIcon = panelIcons[index % panelIcons.length];

                      return (
                        <div
                          key={feature.title}
                          className={cn(
                            'group flex items-start gap-3 rounded-xl border border-l border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-sm text-primary-foreground/90',
                            quietMedia && 'animate-slide-in-from-left animate-duration-500 animate-ease-out motion-reduce:animate-none',
                            hideMediaImage && 'border-border/70 border-l-primary bg-primary/5 text-foreground transition-colors duration-200 hover:border-primary/25 hover:bg-primary/7',
                          )}
                          style={quietMedia ? { animationDelay: `${320 + index * 120}ms`, animationFillMode: 'backwards' } : undefined}
                        >
                          <span
                            className={cn(
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 transition-all duration-300',
                              hideMediaImage && 'bg-card text-primary shadow-lg shadow-primary/15 ring-1 ring-primary/10 group-hover:bg-card',
                            )}
                          >
                            <FeatureIcon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[15px] font-medium leading-5">{feature.title}</span>
                            {feature.description && (
                              <span className={cn('mt-1 block text-sm leading-5', hideMediaImage ? 'text-muted-foreground' : 'text-primary-foreground/70')}>{feature.description}</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {!quietMedia && (
                <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-primary-foreground/90" />
                    <p className="text-sm leading-6 text-primary-foreground/75">Applications are reviewed before role access is enabled, keeping partner dashboards limited to verified accounts.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section
          className={cn(
            'flex items-center justify-center bg-background px-4 py-8 sm:px-6 animate-in fade-in slide-in-from-bottom-3 duration-500 motion-reduce:animate-none lg:slide-in-from-right-4',
            fullWidth ? cn(fullWidthMinHeight, 'lg:px-10 xl:px-14') : 'min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2.5rem)] lg:px-10',
          )}
        >
          <div className={cn('w-full max-w-xl', contentClassName)}>
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                Dubai Property IQ
              </Link>
            </div>

            <Link
              href={backHref}
              className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>

            <div className="mb-6 rounded-xl border bg-card p-5 shadow-sm lg:hidden">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <BadgeCheck className="h-4 w-4" />
                {eyebrow}
              </div>
              <h1 className="text-2xl font-semibold leading-tight tracking-normal text-foreground">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
