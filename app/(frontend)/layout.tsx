import type { Metadata } from 'next';
import { Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import './globals.css';
import { FrontEndProvider } from '@/providers/frontend-provider';
import { getHeaderMenus } from '@/lib/db/menus/queries';

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
  title: 'Dubai Property IQ | Dubai Real Estate & Investment Intelligence',
  description: 'Explore Dubai properties, communities, developers, and investment tools with clearer market context.',
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
      <body className={`${plusJakarta.variable} ${geistMono.variable} antialiased`}>
        <FrontEndProvider>
          <Header menus={menus ?? undefined} />
          <main>{children}</main>
          <Footer />
        </FrontEndProvider>
      </body>
    </html>
  );
}
