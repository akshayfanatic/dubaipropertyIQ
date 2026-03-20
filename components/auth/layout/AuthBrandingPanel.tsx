'use client';

import { BarChart3, Home, TrendingUp } from 'lucide-react';
import SiteLogo from '@/components/ui/SiteLogo';

const features = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track market trends with live data',
  },
  {
    icon: Home,
    title: 'Property Valuations',
    description: 'AI-powered price estimates',
  },
  {
    icon: TrendingUp,
    title: 'Investment Insights',
    description: 'Data-driven recommendations',
  },
];

export function AuthBrandingPanel() {
  return (
    <div className="relative hidden w-full overflow-hidden bg-gradient-to-br from-auth-brand-bg via-auth-brand-bg to-auth-brand-bg/95 md:flex md:w-1/2 lg:w-1/2">
      {/* Animated background elements */}
      <div className="absolute inset-0 ">
        {/* Primary blob - subtle float animation */}
        <div className="absolute -left-8 -top-8 h-80 w-80 animate-pulse rounded-full bg-primary/20 blur-3xl [animation-duration:8s]" />
        {/* Secondary blob - slower pulse */}
        <div className="absolute -bottom-12 right-0 h-96 w-96 animate-pulse rounded-full bg-primary/15 blur-3xl [animation-duration:10s]" />
        {/* Center accent blob */}
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-duration:12s]" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 text-white lg:px-12 animate-fade-up animate-once animate-duration-1000 animate-ease-out">
        {/* Logo */}
        <div className="animate-fade-in animate-duration-700">
          <SiteLogo />
        </div>

        {/* Features */}
        <div className="w-full max-w-md space-y-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-white/5 animate-slide-in-from-left animate-duration-500"
              style={{
                animationDelay: `${(index + 1) * 150}ms`,
              }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-primary/20">
                <feature.icon className="h-5 w-5 text-primary/90" />
              </div>
              <div className="pt-1.5">
                <h3 className="font-semibold text-white/95">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicator */}
        <div className="mt-12 flex items-center gap-2 text-center animate-fade-in animate-duration-500 animate-delay-700">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-auth-brand-bg bg-gradient-to-br from-white/20 to-white/5" />
            ))}
          </div>
          <p className="text-xs text-white/40">Trusted by 10,000+ investors in the UAE</p>
        </div>
      </div>
    </div>
  );
}
