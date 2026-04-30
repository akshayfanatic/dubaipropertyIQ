import { SocialLinks } from './SocialLinks';
import { QuickLinks } from './QuickLinks';
import { ContactInfo } from './ContactInfo';
import { FooterCopyright } from './FooterCopyright';
import { FooterBrand } from './FooterBrand';
import { FooterProps } from '@/types/footer';

export default function Footer({}: FooterProps) {
  return (
    <footer className="w-full border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FooterBrand />

          {/* Quick Links */}
          <QuickLinks title="Quick Links" />

          {/* Contact */}
          <ContactInfo title="Contact Us">
            <SocialLinks />
          </ContactInfo>
        </div>
      </div>

      <FooterCopyright />
    </footer>
  );
}
