import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold">Property Not Found</h1>
        <p className="text-muted-foreground">The property you&apos;re looking for is not available or has been sold.</p>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
