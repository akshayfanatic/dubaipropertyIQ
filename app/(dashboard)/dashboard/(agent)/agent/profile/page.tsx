import { Building2, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const profileFields = [
  { label: 'Display name', value: 'Agent profile', icon: User },
  { label: 'Email', value: 'Connected account email', icon: Mail },
  { label: 'Phone', value: 'Add contact number', icon: Phone },
  { label: 'Agency', value: 'Add brokerage details', icon: Building2 },
];

export default function AgentProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          Agent profile
        </Badge>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Public agent profile scaffolding for contact details, brokerage information, and future listing attribution.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>Editable profile form will be added here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {profileFields.map((field) => {
              const Icon = field.icon;

              return (
                <div key={field.label} className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{field.label}</p>
                    <p className="truncate text-sm text-muted-foreground">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end">
            <Button disabled>Save profile coming soon</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
