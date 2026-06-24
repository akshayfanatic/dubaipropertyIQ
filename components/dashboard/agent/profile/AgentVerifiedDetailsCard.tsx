import { Building2, Fingerprint, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tables } from '@/types/db/supabase-generated';

type AgentProfile = Tables<'agent_profiles'>;

function fallback(value: string | null) {
  return value?.trim() || 'Not provided';
}

interface AgentVerifiedDetailsCardProps {
  profile: AgentProfile;
}

export function AgentVerifiedDetailsCard({ profile }: AgentVerifiedDetailsCardProps) {
  const summary = [
    { label: 'Email', value: profile.email, icon: Mail },
    { label: 'Phone', value: fallback(profile.phone), icon: Phone },
    { label: 'Agency', value: fallback(profile.agency_name), icon: Building2 },
    { label: 'RERA number', value: profile.rera_number, icon: Fingerprint },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verified details</CardTitle>
        <CardDescription>Read-only account context.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {summary.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="truncate text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
