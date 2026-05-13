import { Card, CardContent } from '@/components/ui/card';
import { PropertyWhatsAppButton } from '@/components/properties/PropertyWhatsAppButton';
import type { PropertyListItem } from '@/types/property';
import { CheckCircle2 } from 'lucide-react';

interface PropertySidebarProps {
  property: PropertyListItem;
}

export function PropertySidebar({ property }: PropertySidebarProps) {
  const categoryName = property.category?.[0]?.name || 'Property';

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Interested in this property?</h3>
        <p className="text-sm text-muted-foreground">Contact us via WhatsApp for more information, schedule a viewing, or get details about similar properties.</p>
        <PropertyWhatsAppButton property={property} variant="card" className="h-12 w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold border-0" />
        <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Reference:</strong> {property.slug}
          </p>
          <p>
            <strong>Type:</strong> {categoryName}
          </p>
          {property.golden_visa_eligible && (
            <p className="flex items-center gap-2 text-amber-600">
              <CheckCircle2 className="h-4 w-4" />
              Golden Visa Eligible
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
