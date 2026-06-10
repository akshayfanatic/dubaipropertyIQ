import { Heart } from 'lucide-react';

import { WidgetCard } from '@/components/shared/WidgetCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerSavedPropertiesLoading() {
  return (
    <WidgetCard icon={Heart} title="Saved properties" description="Properties you save for later comparison will appear here.">
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-90 rounded-xl sm:h-95 xl:h-100" />
        ))}
      </div>
    </WidgetCard>
  );
}
