import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AgentProfileNotProvisioned() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Agent Profile Settings" description="Manage your agent account details and security." showBackButton />

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <CardTitle>Profile not active yet</CardTitle>
              <CardDescription className="mt-1">
                Approved applications create an agent profile automatically. If your application was approved recently, refresh after the review completes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/become-partner/application-status">View application status</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
