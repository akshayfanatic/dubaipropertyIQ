import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineProject {
  id: string;
  name: string;
  status: 'completed' | 'under_construction' | 'announced';
  year: string;
}

interface DeveloperTimelineProps {
  projects: TimelineProject[];
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  under_construction: { icon: Construction, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  announced: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export function DeveloperTimeline({ projects }: DeveloperTimelineProps) {
  return (
    <Card className="p-6 border-border/50 shadow-sm">
      <h3 className="text-xl font-bold mb-6">Project Timeline</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {projects.map((project) => {
          const StatusIcon = statusConfig[project.status].icon;

          return (
            <div key={project.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10',
                  statusConfig[project.status].bg,
                )}
              >
                <StatusIcon className={cn('w-4 h-4', statusConfig[project.status].color)} />
              </div>

              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', statusConfig[project.status].bg, statusConfig[project.status].color)}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">{project.year}</span>
                </div>
                <h4 className="text-base font-bold text-foreground">{project.name}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
