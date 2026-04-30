import Link from 'next/link';

export function FooterBrand() {
  return (
    <div className="lg:col-span-2">
      <Link href="/" className="inline-flex items-center gap-0.5 mb-4">
        <div className="text-lg font-normal tracking-wide">
          <span className="text-foreground">Dubai</span>
          <span className="text-muted-foreground">PropertyIQ</span>
        </div>
      </Link>
      <p className="text-sm text-muted-foreground max-w-md">Your trusted partner for finding premium properties in Dubai.</p>
    </div>
  );
}
