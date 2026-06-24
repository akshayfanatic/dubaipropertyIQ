import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgentNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="size-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
          <p className="text-sm leading-6 text-muted-foreground">This agent dashboard page does not exist or has been moved.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/agent">Back to agent dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
