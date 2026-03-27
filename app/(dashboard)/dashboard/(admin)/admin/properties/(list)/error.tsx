'use client';

import { ErrorComponent } from '@/components/ui/error';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PropertiesError({ reset }: ErrorProps) {
  return <ErrorComponent title="Something Went Wrong in Properties" onRetry={reset} />;
}
