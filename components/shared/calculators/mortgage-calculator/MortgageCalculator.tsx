'use client';

import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CalculatorCard } from '@/components/shared/calculators/CalculatorCard';
import { CalculatorReportLeadForm } from '@/components/leads/CalculatorReportLeadForm';
import { calculateMortgage, generateAmortizationSchedule, formatNumber } from '@/components/shared/calculators/mortgage-calculator/calculator';
import { MORTGAGE_CONSTANTS } from '@/components/shared/calculators/mortgage-calculator/constants';
import { mortgageSchema, type MortgageFormData } from '@/components/shared/calculators/mortgage-calculator/validation';
import { MortgageReportPdfDownload, type MortgageReportData } from '@/components/shared/calculators/mortgage-calculator/MortgageReportPdf';
import type { CityWithAreaCount } from '@/types/city';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/price';
import { Calculator, LockKeyhole } from 'lucide-react';

interface MortgageCalculatorProps {
  city?: CityWithAreaCount | null;
  initialValue?: number;
}

const RESIDENCY_OPTIONS = [
  { value: 20, label: 'UAE resident (20%)' },
  { value: 25, label: 'Non-resident (25%)' },
] as const;

export function MortgageCalculator({ initialValue }: MortgageCalculatorProps) {
  const [showAmortization, setShowAmortization] = useState(false);

  const { register, control, setValue } = useForm<MortgageFormData>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      propertyValue: initialValue || 2_000_000,
      downPaymentPercent: 20,
      interestRate: MORTGAGE_CONSTANTS.DEFAULT_INTEREST_RATE,
      loanTerm: 25,
    },
  });

  const formValues = useWatch({
    control,
    name: ['propertyValue', 'downPaymentPercent', 'interestRate', 'loanTerm'],
  });

  const [propertyValue, downPaymentPercent, interestRate, loanTerm] = formValues;

  const results = useMemo(
    () =>
      calculateMortgage({
        propertyValue: propertyValue ?? 2_000_000,
        downPaymentPercent: downPaymentPercent ?? 20,
        interestRate: interestRate ?? MORTGAGE_CONSTANTS.DEFAULT_INTEREST_RATE,
        loanTerm: loanTerm ?? 25,
      }),
    [propertyValue, downPaymentPercent, interestRate, loanTerm],
  );

  const amortizationSchedule = useMemo(
    () =>
      generateAmortizationSchedule({
        propertyValue: propertyValue ?? 2_000_000,
        downPaymentPercent: downPaymentPercent ?? 20,
        interestRate: interestRate ?? MORTGAGE_CONSTANTS.DEFAULT_INTEREST_RATE,
        loanTerm: loanTerm ?? 25,
      }),
    [propertyValue, downPaymentPercent, interestRate, loanTerm],
  );

  const downPaymentAmount = ((propertyValue ?? 2_000_000) * (downPaymentPercent ?? 20)) / 100;
  const reportData: MortgageReportData = {
    propertyValue: formatPrice(propertyValue ?? 0),
    downPayment: formatPrice(results.downPayment),
    downPaymentPercent: `${downPaymentPercent ?? 20}%`,
    loanAmount: formatPrice(results.loanAmount),
    interestRate: `${interestRate ?? MORTGAGE_CONSTANTS.DEFAULT_INTEREST_RATE}%`,
    loanTerm: `${loanTerm ?? 25} years`,
    monthlyPayment: formatPrice(results.monthlyPayment),
    totalInterest: formatPrice(results.totalInterest),
    totalPayment: formatPrice(results.totalAmount),
    rows: amortizationSchedule.map((row) => ({
      year: row.year,
      principal: formatPrice(row.principal),
      interest: formatPrice(row.interest),
      balance: formatPrice(row.balance),
    })),
  };
  const reportContext = [
    `Property value: ${reportData.propertyValue}`,
    `Down payment: ${reportData.downPayment} (${reportData.downPaymentPercent})`,
    `Loan amount: ${reportData.loanAmount}`,
    `Interest rate: ${reportData.interestRate}`,
    `Loan term: ${reportData.loanTerm}`,
    `Monthly payment: ${reportData.monthlyPayment}`,
    `Total interest: ${reportData.totalInterest}`,
  ].join('\n');

  const handleResidencyChange = (percent: number) => {
    setValue('downPaymentPercent', percent);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left - Inputs */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* Property Value Card */}
        <CalculatorCard
          title="Property value"
          interactive
          value={
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary">{formatNumber(propertyValue ?? 2_000_000)}</span>
              <span className="text-muted-foreground">AED</span>
            </div>
          }
          footer={
            <>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatNumber(MORTGAGE_CONSTANTS.MIN_PROPERTY_VALUE)} AED</span>
                <span>{formatNumber(MORTGAGE_CONSTANTS.MAX_PROPERTY_VALUE)} AED</span>
              </div>
              <Input type="number" value={propertyValue} {...register('propertyValue', { valueAsNumber: true })} className="mt-4" />
            </>
          }
        >
          <div className="relative px-2">
            <Slider
              value={[propertyValue ?? 2_000_000]}
              onValueChange={([v]) => setValue('propertyValue', v)}
              min={MORTGAGE_CONSTANTS.MIN_PROPERTY_VALUE}
              max={MORTGAGE_CONSTANTS.MAX_PROPERTY_VALUE}
              step={100000}
              className="w-full"
            />
          </div>
        </CalculatorCard>

        {/* Residency / Down Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Residency Status */}
          <CalculatorCard title="Down payment" description="Select based on residency status">
            <div className="space-y-2">
              {RESIDENCY_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleResidencyChange(option.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                    (downPaymentPercent ?? 20) === option.value ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/70',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CalculatorCard>

          {/* Custom Down Payment */}
          <CalculatorCard
            title="Custom amount"
            value={
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-chart-2">{formatNumber(downPaymentAmount)}</span>
                <span className="text-muted-foreground text-sm">AED</span>
                <span className="ml-2 text-sm font-medium text-chart-2">({downPaymentPercent ?? 20}%)</span>
              </div>
            }
            footer={
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{MORTGAGE_CONSTANTS.MIN_DOWN_PAYMENT}%</span>
                <span>{MORTGAGE_CONSTANTS.MAX_DOWN_PAYMENT}%</span>
              </div>
            }
          >
            <div className="relative px-2">
              <Slider
                value={[downPaymentPercent ?? 20]}
                onValueChange={([v]) => setValue('downPaymentPercent', v)}
                min={MORTGAGE_CONSTANTS.MIN_DOWN_PAYMENT}
                max={MORTGAGE_CONSTANTS.MAX_DOWN_PAYMENT}
                step={1}
                className="w-full"
              />
            </div>
          </CalculatorCard>
        </div>

        {/* Interest Rate & Loan Term */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interest Rate */}
          <CalculatorCard
            title="Interest rate %"
            footer={
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5%</span>
                <span>15%</span>
              </div>
            }
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative px-2 flex-1">
                <Slider value={[interestRate ?? MORTGAGE_CONSTANTS.DEFAULT_INTEREST_RATE]} onValueChange={([v]) => setValue('interestRate', v)} min={0.5} max={15} step={0.25} className="w-full" />
              </div>
              <Input type="number" value={interestRate} {...register('interestRate', { valueAsNumber: true })} className="w-20 text-center" step={0.25} />
            </div>
          </CalculatorCard>

          {/* Loan Term */}
          <CalculatorCard
            title="Loan term"
            footer={
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{MORTGAGE_CONSTANTS.MIN_LOAN_TERM} years</span>
                <span>{MORTGAGE_CONSTANTS.MAX_LOAN_TERM} years</span>
              </div>
            }
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative px-2 flex-1">
                <Slider
                  value={[loanTerm ?? 25]}
                  onValueChange={([v]) => setValue('loanTerm', v)}
                  min={MORTGAGE_CONSTANTS.MIN_LOAN_TERM}
                  max={MORTGAGE_CONSTANTS.MAX_LOAN_TERM}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-1">
                <Input type="number" value={loanTerm} {...register('loanTerm', { valueAsNumber: true })} className="w-16 text-center" />
                <span className="text-sm text-muted-foreground">years</span>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Right - Results (Sticky on desktop) */}
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 space-y-4">
        {/* Monthly Payment Card */}
        <div className="p-6 rounded-2xl bg-primary/10 border-2 border-primary/20 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Monthly payment</p>
          <p className="text-3xl font-bold text-foreground">{formatPrice(results.monthlyPayment)}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Loan amount</p>
            <p className="text-lg font-bold text-foreground">{formatPrice(results.loanAmount)}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Down payment</p>
            <p className="text-lg font-bold text-foreground">{formatPrice(results.downPayment)}</p>
          </div>
        </div>

        {/* Total Interest Card */}
        <div className="p-4 rounded-xl border border-chart-3/30 bg-chart-3/5">
          <p className="text-xs text-muted-foreground mb-1">Total interest</p>
          <p className="text-xl font-bold text-chart-3">{formatPrice(results.totalInterest)}</p>
          <p className="text-xs text-muted-foreground mt-1">over {loanTerm ?? 25} years</p>
        </div>

        {/* Total Amount */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Total payment</p>
          <p className="text-lg font-bold text-foreground">{formatPrice(results.totalAmount)}</p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-lg">
          <button
            onClick={() => setShowAmortization(false)}
            className={cn(
              'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
              !showAmortization ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Summary
          </button>
          <button
            onClick={() => setShowAmortization(true)}
            className={cn(
              'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
              showAmortization ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Amortization
          </button>
        </div>

        {/* Amortization Schedule (when shown) */}
        {showAmortization && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-96 overflow-y-auto">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Year</th>
                    <th className="text-right py-2 px-2 font-semibold text-chart-4">Interest</th>
                    <th className="text-right py-2 px-2 font-semibold text-primary">Principal</th>
                    <th className="text-right py-2 px-2 font-semibold text-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.map((row) => (
                    <tr key={row.year} className="border-b border-border/50">
                      <td className="py-2 px-3 text-foreground">{row.year}</td>
                      <td className="text-right py-2 px-2 text-chart-4">{formatPrice(row.interest)}</td>
                      <td className="text-right py-2 px-2 text-primary">{formatPrice(row.principal)}</td>
                      <td className="text-right py-2 px-2 text-muted-foreground">{formatPrice(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Email-gated mortgage report */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <LockKeyhole className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Full mortgage report</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Unlock the amortization PDF with your email.</p>
            </div>
          </div>
          <CalculatorReportLeadForm
            calculatorName="Mortgage Calculator"
            messageContext={reportContext}
            unlockedContent={
              <div className="grid gap-3 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                <p className="font-bold text-foreground">Mortgage PDF ready.</p>
                <p>Includes monthly payment, total interest, total payment, loan amount, down payment, and yearly amortization schedule.</p>
                <MortgageReportPdfDownload data={reportData} />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
