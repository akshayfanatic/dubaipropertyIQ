import { Card, CardContent } from '@/components/ui/card';
import { PropertyWhatsAppButton } from '../PropertyWhatsAppButton';
import { Property } from '@/types';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';

interface SidebarContentProps {
  property: Property & { category?: { name: string } };
}
const SideBarContent = ({ property }: SidebarContentProps) => {
  const categoryName = property.category?.name;
  return (
    <Card className="border-none shadow-xl relative overflow-hidden rounded-2xl bg-card">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Interested in this property?</h3>
        <p className="text-sm text-muted-foreground">Contact us via WhatsApp for more information, schedule a viewing, or get details about similar properties.</p>

        <PropertyWhatsAppButton property={property} variant="primary" className="h-12 w-full" />

        <div className="pt-6 border-t space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                Reference
              </span>
              <span className="font-medium text-foreground uppercase tracking-wider text-[11px] bg-muted px-2 py-0.5 rounded">{property.slug}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                Type
              </span>
              <span className="font-medium text-foreground">{categoryName}</span>
            </div>
          </div>

          {property.golden_visa_eligible && (
            <div className="pt-2">
              <GoldenVisaBadge variant="gradient-soft" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SideBarContent;
