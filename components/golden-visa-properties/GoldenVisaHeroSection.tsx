import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';
import { PageBanner } from '@/components/shared/PageBanner';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function GoldenVisaHeroSection() {
  return (
    <PageBanner
      imageUrl="/assets/images/hero-bg-2.jpg"
      alt="Dubai skyline for Golden Visa eligible property search"
      heightClassName="min-h-[560px] md:min-h-[590px]"
      imageClassName="scale-[1.02]"
      overlayClassName="bg-[linear-gradient(90deg,oklch(0.16_0.04_260.47_/_0.9),oklch(0.2_0.03_263.61_/_0.68)_52%,oklch(0.2_0.03_263.61_/_0.28)),linear-gradient(0deg,oklch(0.16_0.04_260.47_/_0.5),transparent_42%)]"
      contentClassName="mx-auto w-[min(92%,1280px)] px-0 py-14 md:py-18"
    >
      <div className="max-w-4xl text-primary-foreground">
        <GoldenVisaBadge variant="gradient-soft" className="mb-6 shadow-sm" />
        <h1 className="max-w-4xl text-[clamp(2.25rem,5vw,4.4rem)] font-extrabold leading-[1.04] tracking-normal">Golden Visa Properties in Dubai</h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-primary-foreground/86 sm:text-lg">
          Browse AED 2M+ Dubai listings and get a clearer property path before preparing your visa file.
        </p>
        <Link href="#properties" className={cn(buttonVariants({ size: 'lg' }), 'mt-8 min-h-11 gap-2 text-primary-foreground shadow-md shadow-foreground/20')}>
          View eligible properties
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </PageBanner>
  );
}
