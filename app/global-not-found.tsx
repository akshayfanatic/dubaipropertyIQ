// Import global styles and fonts
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';
import '../app/(frontend)/globals.css';
import { NotFound } from '@/components/ui/not-found';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={geist.className}>
      <body>
        <NotFound />
      </body>
    </html>
  );
}
