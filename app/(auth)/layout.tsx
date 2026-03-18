import type { Metadata } from 'next';
import '@/app/(frontend)/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Dubai Property IQ - Auth',
  description: 'Sign in to your Dubai Property IQ account',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <div className="flex min-h-screen flex-col md:flex-row">{children}</div>
      </body>
    </html>
  );
}
