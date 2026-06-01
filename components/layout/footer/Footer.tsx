import { FooterCopyright } from './FooterCopyright';
import { FooterBrand } from './FooterBrand';
import { QuickLinks } from './QuickLinks';
import { FooterProps } from '@/types/footer';
import Link from 'next/link';

const footerColumns = [
  {
    title: 'Properties',
    links: [
      { label: 'Buy', href: '/search' },
      { label: 'Off-Plan Projects', href: '/search?property_status=off_plan' },
      { label: 'Golden Visa Homes', href: '/search?golden_visa=true' },
      { label: 'Advanced Search', href: '/search' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'True Cost Calculator', href: '/calculators/rent-vs-buy-calculator' },
      { label: 'Rental Yield', href: '/calculators/rent-vs-buy-calculator' },
      { label: 'Mortgage', href: '/calculators/mortgage-calculator' },
      { label: 'Service Charges', href: '/blogs' },
    ],
  },
];

const pageLinks = [
  { label: 'About', href: '/about' },
  { label: 'List Your Property', href: '/pages/list-your-property' },
  { label: 'Guides', href: '/blogs' },
  { label: 'Contact', href: '/pages/contact' },
];

const legalLinks = [
  { label: 'Privacy', href: '/pages/privacy-policy' },
  { label: 'Terms', href: '/pages/terms-conditions' },
  { label: 'Cookies', href: '/pages/cookie-policy' },
];

export default function Footer({}: FooterProps) {
  return (
    <footer className="relative mt-auto w-full overflow-hidden bg-[#081834] pt-12 text-white/70 sm:pt-16 lg:pt-[4.5rem]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(50%_100%_at_20%_0%,rgba(29,111,224,0.12),transparent_60%)]" />

      <div className="relative z-10 mx-auto w-[min(92%,1440px)]">
        <div className="grid gap-8 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <FooterBrand />

          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h5 className="text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white">{column.title}</h5>
              <nav aria-label={`${column.title} footer links`} className="grid gap-1">
                {column.links.map((link) => (
                  <Link key={link.label} href={link.href} className="py-1 text-[0.88rem] text-white/65 transition-all duration-300 ease-out hover:pl-1.5 hover:text-[#9cc4f7]">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <QuickLinks title="Pages" links={pageLinks} includeDynamic={false} />

          <QuickLinks title="Legal" links={legalLinks} includeDynamic={false} />
        </div>
      </div>

      <FooterCopyright />
    </footer>
  );
}
