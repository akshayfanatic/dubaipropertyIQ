import { Building2, Home, CalendarDays, Rocket } from 'lucide-react';
import { DeveloperKeyStatsCard } from '../card/DeveloperKeyStatsCard';

interface DeveloperStatsProps {
  keyStats: {
    totalProjects: number;
    totalUnitsDelivered: number;
    yearsActive: number;
    activeProjects: number;
  };
}

export function DeveloperStats({ keyStats }: DeveloperStatsProps) {
  const statsData = [
    { label: 'Total Projects', value: keyStats.totalProjects, icon: Building2 },
    { label: 'Units Delivered', value: keyStats.totalUnitsDelivered.toLocaleString(), icon: Home },
    { label: 'Years Active', value: keyStats.yearsActive, icon: CalendarDays },
    { label: 'Active Projects', value: keyStats.activeProjects, icon: Rocket },
  ];

  return (
    <div className="space-y-10">
      {/* Key Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <DeveloperKeyStatsCard key={i} {...stat} />
        ))}
      </div>
    </div>
  );
}
