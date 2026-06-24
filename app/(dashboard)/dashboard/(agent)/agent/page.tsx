import Link from 'next/link';
import { ArrowUpRight, Building2, CheckCircle2, Clock3, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Active listings',
    value: '0',
    description: 'Published properties',
    icon: Building2,
  },
  {
    title: 'Pending review',
    value: '0',
    description: 'Listings awaiting approval',
    icon: Clock3,
  },
  {
    title: 'Profile status',
    value: 'Active',
    description: 'Agent account ready',
    icon: CheckCircle2,
  },
];

const nextSteps = ['Complete your public agent profile', 'Prepare property photos and listing details', 'Submit first listing when listing tools are enabled'];

const AgentPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            Agent portal
          </Badge>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Agent Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage your agent profile, listings, and future enquiries from one workspace.</p>
          </div>
        </div>

        <Button asChild>
          <Link href="/dashboard/agent/profile">
            Complete profile
            <ArrowUpRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Listings workspace</CardTitle>
            <CardDescription>Listing tools are scaffolded for the next agent workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/25 p-6 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">No listings yet</p>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">Once listing submission is enabled, your properties and review status will appear here.</p>
              </div>
              <Button variant="outline" disabled>
                Add property coming soon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>Keep your agent workspace ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {nextSteps.map((step) => (
                <div key={step} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm leading-5 text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPage;
