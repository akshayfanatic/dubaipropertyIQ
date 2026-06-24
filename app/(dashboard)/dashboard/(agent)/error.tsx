'use client';

import { ErrorComponent } from '@/components/ui/error';

export default function AgentError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Agent dashboard error:', error);

  return <ErrorComponent title="Agent dashboard error" description="We could not load this agent workspace. Try again or return to the dashboard." onRetry={reset} />;
}
