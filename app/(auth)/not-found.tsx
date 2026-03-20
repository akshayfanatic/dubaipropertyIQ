import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-8xl font-bold text-muted-foreground/30 select-none">404</span>
        <h1 className="text-2xl font-semibold text-foreground">Page Not Found</h1>
        <p className="max-w-md text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="mt-4 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
