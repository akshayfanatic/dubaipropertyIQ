import { Building2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentPropertiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            Listings
          </Badge>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Properties</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Agent listing management scaffold for property submissions, review status, and future enquiry tracking.</p>
          </div>
        </div>
        <Button disabled>
          <Plus data-icon="inline-start" />
          Add property
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property submissions</CardTitle>
          <CardDescription>Submitted listings will appear here once the workflow is enabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/25 p-6 text-center">
            <Building2 className="size-10 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">No properties submitted</p>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">This area is ready for the agent listing table, filters, and submission actions.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
