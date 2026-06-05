'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, FileSearch, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const AED_TWO_MILLION = 2_000_000;

type PropertyStatus = 'ready' | 'off_plan';
type FinanceStatus = 'fully_paid' | 'mortgaged' | 'payment_plan';

type ResultState = {
  label: string;
  tone: 'eligible' | 'review' | 'notEligible';
  summary: string;
  reasons: string[];
  nextSteps: string[];
};

const resultStyles = {
  eligible: {
    icon: CheckCircle2,
    badge: 'bg-primary/10 text-primary border-primary/20',
    panel: 'bg-primary/5 border-primary/20',
  },
  review: {
    icon: AlertTriangle,
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    panel: 'bg-amber-50/70 border-amber-200',
  },
  notEligible: {
    icon: XCircle,
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
    panel: 'bg-destructive/5 border-destructive/20',
  },
} satisfies Record<ResultState['tone'], { icon: typeof CheckCircle2; badge: string; panel: string }>;

function parseAmount(value: string) {
  const normalized = value.replace(/,/g, '').trim();
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return amount;
}

function formatAed(value: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(value);
}

function assessEligibility(propertyValue: number, ownershipPercent: number, propertyStatus: PropertyStatus, financeStatus: FinanceStatus): ResultState {
  const ownedValue = propertyValue * (ownershipPercent / 100);
  const valueShortfall = AED_TWO_MILLION - ownedValue;
  const needsDocumentReview = propertyStatus === 'off_plan' || financeStatus !== 'fully_paid' || ownershipPercent < 100;

  if (ownedValue < AED_TWO_MILLION) {
    return {
      label: 'Not eligible yet',
      tone: 'notEligible',
      summary: `Owned value is ${formatAed(ownedValue)}, below the AED 2M property route threshold.`,
      reasons: [
        `${formatAed(valueShortfall)} more owned property value is needed to reach AED 2M.`,
        ownershipPercent < 100 ? 'Joint ownership can reduce the applicant-owned value used for review.' : 'The entered property value is below the common threshold.',
      ],
      nextSteps: ['Increase the qualifying property value or combine eligible properties under the applicant name.', 'Request a review before relying on valuation or joint ownership assumptions.'],
    };
  }

  if (needsDocumentReview) {
    return {
      label: 'May be eligible',
      tone: 'review',
      summary: `Owned value reaches ${formatAed(ownedValue)}, but documents need review before applying.`,
      reasons: [
        propertyStatus === 'off_plan' ? 'Off-plan properties usually need payment and project documentation checks.' : 'Ready property route looks stronger from a documentation angle.',
        financeStatus === 'mortgaged' ? 'Mortgaged property usually needs bank/NOC and ownership evidence review.' : 'Payment position must be clear in the application file.',
        ownershipPercent < 100 ? 'Applicant ownership share must support the AED 2M threshold.' : 'Full applicant ownership is easier to evidence.',
      ],
      nextSteps: ['Check title deed, Oqood or SPA, payment evidence, and valuation support.', 'Send the case for property-specific Golden Visa guidance.'],
    };
  }

  return {
    label: 'Likely eligible',
    tone: 'eligible',
    summary: `Owned value reaches ${formatAed(ownedValue)} with a ready, fully paid property profile.`,
    reasons: ['Owned property value meets or exceeds AED 2M.', 'Ready and fully paid property profile is simpler to document.'],
    nextSteps: ['Prepare passport copy, property proof, payment evidence, and medical insurance.', 'Confirm current authority requirements before submission.'],
  };
}

export function GoldenVisaEligibilityChecker() {
  const [propertyValueInput, setPropertyValueInput] = useState('2000000');
  const [ownershipPercentInput, setOwnershipPercentInput] = useState('100');
  const [propertyStatus, setPropertyStatus] = useState<PropertyStatus>('ready');
  const [financeStatus, setFinanceStatus] = useState<FinanceStatus>('fully_paid');

  const propertyValue = parseAmount(propertyValueInput);
  const ownershipPercent = Math.min(100, Math.max(0, parseAmount(ownershipPercentInput)));
  const ownedValue = propertyValue * (ownershipPercent / 100);
  const result = useMemo(() => assessEligibility(propertyValue, ownershipPercent, propertyStatus, financeStatus), [financeStatus, ownershipPercent, propertyStatus, propertyValue]);
  const ResultIcon = resultStyles[result.tone].icon;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.72fr)] lg:items-start">
        <div>
          <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calculator className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Eligibility checker</p>
              <h2 className="mt-1 text-xl font-bold leading-7 text-foreground">Check the AED 2M property route.</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Use this as a first screen before document review. Authority rules and case handling can change.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Property value"
              inputMode="numeric"
              value={propertyValueInput}
              onChange={(event) => setPropertyValueInput(event.target.value)}
              placeholder="2000000"
              aria-describedby="property-value-help"
            />
            <Input
              label="Applicant ownership %"
              inputMode="numeric"
              value={ownershipPercentInput}
              onChange={(event) => setOwnershipPercentInput(event.target.value)}
              placeholder="100"
              aria-describedby="ownership-help"
            />

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Property status</span>
              <Select value={propertyStatus} onValueChange={(value: PropertyStatus) => setPropertyStatus(value)}>
                <SelectTrigger className="h-11 w-full rounded-lg bg-background py-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready / title available</SelectItem>
                  <SelectItem value="off_plan">Off-plan / under payment plan</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Payment position</span>
              <Select value={financeStatus} onValueChange={(value: FinanceStatus) => setFinanceStatus(value)}>
                <SelectTrigger className="h-11 w-full rounded-lg bg-background py-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully_paid">Fully paid</SelectItem>
                  <SelectItem value="mortgaged">Mortgaged</SelectItem>
                  <SelectItem value="payment_plan">Developer payment plan</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="mt-4 grid gap-3 rounded-lg border border-border bg-background p-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            <p id="property-value-help">
              Entered property value: <span className="font-semibold text-foreground">{formatAed(propertyValue)}</span>
            </p>
            <p id="ownership-help">
              Applicant-owned value: <span className="font-semibold text-foreground">{formatAed(ownedValue)}</span>
            </p>
          </div>
        </div>

        <div className={cn('rounded-xl border p-5', resultStyles[result.tone].panel)} aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <span className={cn('inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold', resultStyles[result.tone].badge)}>
              <ResultIcon className="size-4" />
              {result.label}
            </span>
            <ShieldCheck className="size-5 text-primary" />
          </div>

          <p className="mt-4 text-base font-semibold leading-7 text-foreground">{result.summary}</p>

          <div className="mt-5 space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileSearch className="size-4 text-primary" />
                What this means
              </h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                {result.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Next steps</h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                {result.nextSteps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button asChild className="mt-5 w-full" size="lg">
            <a href="#consultation">Request eligibility review</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
