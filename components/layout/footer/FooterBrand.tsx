import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { SocialLinks } from './SocialLinks';

export function FooterBrand() {
  return (
    <div className="max-w-[300px]">
      <Link href="/" className="mb-4 inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white">
        <span className="grid size-9 place-items-center rounded-[11px] bg-[#1d6fe0] text-white shadow-[0_14px_34px_rgba(29,111,224,0.3)]">
          <Building2 className="size-5" />
        </span>
        <span>
          Dubai<span className="text-[#1d6fe0]">Property</span>IQ
        </span>
      </Link>
      <p className="mb-5 text-[0.88rem] leading-7 text-white/70">Dubai&apos;s first investor-intelligence property platform. Smarter property decisions, backed by real data.</p>
      <SocialLinks />
    </div>
  );
}
