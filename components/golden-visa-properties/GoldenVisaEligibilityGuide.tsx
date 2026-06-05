import { FileText, Landmark, ShieldCheck } from 'lucide-react';
import { GoldenVisaBadge } from '@/components/shared/GoldenVisaBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const guideItems = [
  {
    icon: Landmark,
    title: 'Property value',
    description: 'The common qualifying threshold is AED 2M or more in eligible Dubai property value.',
  },
  {
    icon: ShieldCheck,
    title: 'Ownership route',
    description: 'Ready and off-plan properties may need different document checks, depending on payment status and title evidence.',
  },
  {
    icon: FileText,
    title: 'Document review',
    description: 'Passport, property proof, payment evidence, medical insurance, and application documents should be checked before submission.',
  },
];

const documentItems = ['Passport copy', 'Property proof', 'Payment evidence', 'Medical insurance'];

const processSteps = ['Shortlist AED 2M+ properties', 'Confirm ownership and payment position', 'Prepare document file', 'Submit application and track approval'];

export function GoldenVisaEligibilityGuideContent() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Golden Visa review</p>
          <h2 className="mt-2 text-xl font-bold leading-7 text-foreground">Confirm value, documents, and route.</h2>
        </div>
        <GoldenVisaBadge variant="elegant" className="w-fit shrink-0" />
      </div>

      <Tabs defaultValue="checks" className="mt-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-muted/60 p-1">
          <TabsTrigger value="checks" className="min-h-10 px-4">
            Core checks
          </TabsTrigger>
          <TabsTrigger value="documents" className="min-h-10 px-4">
            Documents
          </TabsTrigger>
          <TabsTrigger value="process" className="min-h-10 px-4">
            Process
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="mt-5">
          <div className="grid gap-3 md:grid-cols-3">
            {guideItems.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-6 text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {documentItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
                <FileText className="size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="process" className="mt-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step} className="rounded-lg border border-border bg-background p-4">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{index + 1}</span>
                <p className="mt-3 text-sm font-medium leading-5 text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
