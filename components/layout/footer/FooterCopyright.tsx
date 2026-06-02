import { FooterCopyrightProps } from '@/types/footer';
import Link from 'next/link';

export function FooterCopyright({ text, company = 'Dubai Property IQ', year }: FooterCopyrightProps) {
  const currentYear = year ?? new Date().getFullYear();
  const copyrightText = text ?? `© ${currentYear} ${company}. All rights reserved.`;

  return (
    <div className="relative z-10 border-t border-white/[0.08]">
      <div className="mx-auto flex w-[min(92%,1440px)] flex-col gap-4 py-6 text-[0.82rem] text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{copyrightText}</p>
        <nav aria-label="Legal links" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/pages/privacy-policy" className="transition-colors hover:text-[#9cc4f7]">
            Privacy
          </Link>
          <Link href="/pages/terms-conditions" className="transition-colors hover:text-[#9cc4f7]">
            Terms
          </Link>
          <Link href="/pages/cookie-policy" className="transition-colors hover:text-[#9cc4f7]">
            Cookies
          </Link>
        </nav>
      </div>
    </div>
  );
}
