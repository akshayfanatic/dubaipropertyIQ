import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  logo?: {
    src?: string;
    alt?: string;
    href?: string;
  };
  copyrightText?: string;
}

export default function Footer({ logo, copyrightText }: FooterProps) {
  const logoSrc = logo?.src;
  const logoAlt = logo?.alt ?? 'Dubai Property IQ';
  const logoHref = logo?.href ?? '/';

  const currentYear = new Date().getFullYear();
  const copyright = copyrightText ?? `© ${currentYear} Dubai Property IQ. All rights reserved.`;

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto flex h-16 flex-col items-center justify-between gap-2 px-4 sm:flex-row lg:px-8">
        {/* Logo - Left */}
        <Link href={logoHref} className="flex items-center gap-0.5">
          {logoSrc ? (
            <Image src={logoSrc} alt={logoAlt} width={120} height={32} className="h-8 w-auto" />
          ) : (
            <span className="text-base font-normal tracking-wide">
              <span className="text-foreground">Dubai</span>
              <span className="text-muted-foreground">PropertyIQ</span>
            </span>
          )}
        </Link>

        {/* Copyright - Right */}
        <p className="text-sm text-muted-foreground">{copyright}</p>
      </div>
    </footer>
  );
}
