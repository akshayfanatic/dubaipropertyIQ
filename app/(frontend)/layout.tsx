import type { Metadata } from 'next';
import { Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import './globals.css';
import { FrontEndProvider } from '@/providers/frontend-provider';
import { getHeaderMenus } from '@/lib/db/menus/queries';
import { defaultOpenGraphImage, metadataBase } from '@/lib/utils/seo';
import { JsonLd } from '@/components/shared/JsonLd';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/utils/structured-data';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Dubai Property IQ | Dubai Real Estate & Investment Intelligence',
    template: '%s | Dubai Property IQ',
  },
  description: 'Explore Dubai properties, communities, developers, and investment tools with clearer market context.',
  applicationName: 'Dubai Property IQ',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dubai Property IQ | Dubai Real Estate & Investment Intelligence',
    description: 'Explore Dubai properties, communities, developers, and investment tools with clearer market context.',
    url: '/',
    siteName: 'Dubai Property IQ',
    images: [{ url: defaultOpenGraphImage, alt: 'Dubai skyline and property search' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Property IQ',
    description: 'Dubai real estate, community, developer, and investment intelligence.',
    images: [defaultOpenGraphImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menusResponse = await getHeaderMenus();
  const menus = menusResponse.success ? menusResponse.data : undefined;

  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background antialiased`}>
        <FrontEndProvider>
          <Header menus={menus ?? undefined} />
          <main className="flex-1">{children}</main>
          <Footer />
        </FrontEndProvider>
        <JsonLd id="site-structured-data" data={[createOrganizationSchema(), createWebsiteSchema()]} />
      </body>
    </html>
  );
}
