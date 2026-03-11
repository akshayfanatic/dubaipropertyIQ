'use client';

import { ErrorComponent } from '@/components/ui/error';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Global error caught:', error);

  return <ErrorComponent onRetry={reset} />;
}
