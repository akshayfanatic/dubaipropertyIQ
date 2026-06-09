'use client';

import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CalculatorCard, CalculatorField } from '@/components/shared/calculators/CalculatorCard';
import { CalculatorReportLeadForm } from '@/components/leads/CalculatorReportLeadForm';
import { TrueCostReportPdfDownload, type TrueCostReportData } from '@/components/shared/calculators/rent-vs-buy-calculator/TrueCostReportPdf';
import { calculateComparison, formatNumber, getPaymentBreakdown } from '@/components/shared/calculators/rent-vs-buy-calculator/calculator';
import { DUBAI_FEES } from '@/components/shared/calculators/rent-vs-buy-calculator/constants';
import { calculatorSchema, validateDownPayment, type CalculatorFormData } from '@/components/shared/calculators/rent-vs-buy-calculator/validation';
import type { ResidencyStatus } from '@/components/shared/calculators/rent-vs-buy-calculator/types';
import type { CityWithAreaCount } from '@/types/city';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/price';
import { BarChart3, Home, LockKeyhole, TrendingDown } from 'lucide-react';

interface TrueCostCalculatorProps {
  city?: CityWithAreaCount | null;
  initialRent?: number;
  initialPrice?: number;
}

const RESIDENCY_OPTIONS: { value: ResidencyStatus; label: string }[] = [
  { value: 'uae_national', label: 'UAE national' },
  { value: 'uae_resident', label: 'UAE resident' },
  { value: 'non_resident', label: 'Non resident' },
];

export function TrueCostCalculator({ initialRent, initialPrice }: TrueCostCalculatorProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const { register, control, setValue } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      annualRent: initialRent || 80_000,
      purchasePrice: initialPrice || 1_200_000,
      residencyStatus: 'uae_resident',
      downPaymentPercent: 20,
      mortgageYears: 25,
      interestRate: DUBAI_FEES.DEFAULT_INTEREST_RATE,
      dldFeePercent: DUBAI_FEES.DLD_FEE_PERCENT,
      agentBuyFeePercent: DUBAI_FEES.AGENT_BUY_FEE_PERCENT,
      agentRentFeePercent: DUBAI_FEES.AGENT_RENT_FEE_PERCENT,
      propertySizeSqft: 900,
      annualRentalIncome: initialRent || 80_000,
      serviceChargePerSqft: DUBAI_FEES.SERVICE_CHARGE_PER_SQFT,
      insurancePercent: DUBAI_FEES.INSURANCE_PERCENT,
      maintenancePercent: DUBAI_FEES.MAINTENANCE_PERCENT,
      propertyManagementPercent: DUBAI_FEES.PROPERTY_MANAGEMENT_PERCENT,
      vacancyPercent: DUBAI_FEES.VACANCY_PERCENT,
      appreciationRate: DUBAI_FEES.APPRECIATION_RATE * 100,
    },
  });

  const formValues = useWatch({
    control,
    name: [
      'annualRent',
      'purchasePrice',
      'residencyStatus',
      'downPaymentPercent',
      'mortgageYears',
      'interestRate',
      'propertySizeSqft',
      'annualRentalIncome',
      'serviceChargePerSqft',
      'insurancePercent',
      'maintenancePercent',
      'propertyManagementPercent',
      'vacancyPercent',
      'appreciationRate',
    ],
  });

  const [
    annualRent,
    purchasePrice,
    residencyStatus,
    downPaymentPercent,
    mortgageYears,
    interestRate,
    propertySizeSqft,
    annualRentalIncome,
    serviceChargePerSqft,
    insurancePercent,
    maintenancePercent,
    propertyManagementPercent,
    vacancyPercent,
    appreciationRate,
  ] = formValues;

  const comparison = useMemo(
    () =>
      calculateComparison(
        {
          annualRent: annualRent ?? 80_000,
          purchasePrice: purchasePrice ?? 1_200_000,
          residencyStatus: residencyStatus ?? 'uae_resident',
          downPaymentPercent: downPaymentPercent ?? 20,
          mortgageYears: mortgageYears ?? 25,
          interestRate: interestRate ?? DUBAI_FEES.DEFAULT_INTEREST_RATE,
          propertySizeSqft: propertySizeSqft ?? 900,
          annualRentalIncome: annualRentalIncome ?? annualRent ?? 80_000,
          serviceChargePerSqft: serviceChargePerSqft ?? DUBAI_FEES.SERVICE_CHARGE_PER_SQFT,
          insurancePercent: insurancePercent ?? DUBAI_FEES.INSURANCE_PERCENT,
          maintenancePercent: maintenancePercent ?? DUBAI_FEES.MAINTENANCE_PERCENT,
          propertyManagementPercent: propertyManagementPercent ?? DUBAI_FEES.PROPERTY_MANAGEMENT_PERCENT,
          vacancyPercent: vacancyPercent ?? DUBAI_FEES.VACANCY_PERCENT,
          appreciationRate: appreciationRate ?? DUBAI_FEES.APPRECIATION_RATE * 100,
          dldFeePercent: DUBAI_FEES.DLD_FEE_PERCENT,
          agentBuyFeePercent: DUBAI_FEES.AGENT_BUY_FEE_PERCENT,
          agentRentFeePercent: DUBAI_FEES.AGENT_RENT_FEE_PERCENT,
        },
        25,
      ),
    [
      annualRent,
      purchasePrice,
      residencyStatus,
      downPaymentPercent,
      mortgageYears,
      interestRate,
      propertySizeSqft,
      annualRentalIncome,
      serviceChargePerSqft,
      insurancePercent,
      maintenancePercent,
      propertyManagementPercent,
      vacancyPercent,
      appreciationRate,
    ],
  );

  const breakdown = useMemo(() => getPaymentBreakdown(comparison), [comparison]);

  const downPaymentValidation = useMemo(() => validateDownPayment(residencyStatus ?? 'uae_resident', downPaymentPercent ?? 20), [residencyStatus, downPaymentPercent]);

  const handleResidencyChange = (value: ResidencyStatus) => {
    setValue('residencyStatus', value);
    const validation = validateDownPayment(value, downPaymentPercent ?? 20);
    if (!validation.valid) {
      setValue('downPaymentPercent', validation.minPercent);
    }
  };

  const buyingIsBetter = comparison.winner === 'buy';
  const rentIsBetter = comparison.winner === 'rent';

  const downPaymentAmount = ((purchasePrice ?? 1_200_000) * (downPaymentPercent ?? 20)) / 100;
  const tenYearRoi = comparison.roi.find((item) => item.years === 10) ?? comparison.roi[comparison.roi.length - 1];
  const reportContext = [
    `Purchase price: ${formatPrice(purchasePrice ?? 0)}`,
    `Annual rent: ${formatPrice(annualRent ?? 0)}`,
    `Annual rental income: ${formatPrice(annualRentalIncome ?? 0)}`,
    `Service charge: ${formatPrice(comparison.buy.annualServiceCharges)}/year`,
    `Insurance: ${formatPrice(comparison.buy.annualInsurance)}/year`,
    `Maintenance reserve: ${formatPrice(comparison.buy.annualMaintenanceReserve)}/year`,
    `10-year ROI: ${tenYearRoi.roiPercent.toFixed(1)}%`,
  ].join('\n');
  const reportData: TrueCostReportData = {
    purchasePrice: formatPrice(purchasePrice ?? 0),
    annualRent: formatPrice(annualRent ?? 0),
    annualRentalIncome: formatPrice(annualRentalIncome ?? 0),
    serviceCharge: `${formatPrice(comparison.buy.annualServiceCharges)}/year`,
    insurance: `${formatPrice(comparison.buy.annualInsurance)}/year`,
    maintenanceReserve: `${formatPrice(comparison.buy.annualMaintenanceReserve)}/year`,
    tenYearRoi: `${tenYearRoi.roiPercent.toFixed(1)}%`,
    tenYearGrossRentalIncome: formatPrice(tenYearRoi.grossRentalIncome),
    rows: comparison.roi.map((item) => ({
      years: item.years,
      netRentalIncome: formatPrice(item.netRentalIncome),
      estimatedPropertyValue: formatPrice(item.estimatedPropertyValue),
      roiPercent: `${item.roiPercent.toFixed(1)}%`,
    })),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left - Inputs */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* Input Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Annual Rent Card */}
          <CalculatorCard
            title="Annual rent"
            interactive
            value={
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">{formatNumber(annualRent)}</span>
                <span className="text-muted-foreground">AED</span>
              </div>
            }
            footer={
              <>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(20000)} AED</span>
                  <span>{formatNumber(2000000)} AED</span>
                </div>
                <Input type="number" value={annualRent} {...register('annualRent', { valueAsNumber: true })} className="mt-4" />
              </>
            }
          >
            <div className="relative px-2">
              <Slider value={[annualRent]} onValueChange={([v]) => setValue('annualRent', v)} min={20000} max={2000000} step={10000} className="w-full" />
            </div>
          </CalculatorCard>

          {/* Purchase Price Card */}
          <CalculatorCard
            title="Purchase price"
            interactive
            value={
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">{formatNumber(purchasePrice)}</span>
                <span className="text-muted-foreground">AED</span>
              </div>
            }
            footer={
              <>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(300000)} AED</span>
                  <span>{formatNumber(20000000)} AED</span>
                </div>
                <Input type="number" value={purchasePrice} {...register('purchasePrice', { valueAsNumber: true })} className="mt-4" />
              </>
            }
          >
            <div className="relative px-2">
              <Slider value={[purchasePrice]} onValueChange={([v]) => setValue('purchasePrice', v)} min={300000} max={20000000} step={50000} className="w-full" />
            </div>
          </CalculatorCard>
        </div>

        {/* Residency Status - Full Width */}
        <CalculatorCard title="Residency status" description="It can impact down payment requirements when getting a mortgage." className="mb-6">
          <div className="gap-2 p-1.5 bg-muted rounded-xl inline-flex">
            {RESIDENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleResidencyChange(option.value)}
                className={cn(
                  'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  residencyStatus === option.value ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CalculatorCard>

        {/* Down Payment & Mortgage Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Down Payment */}
          <CalculatorCard
            title="Down payment"
            value={
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-chart-2">{downPaymentAmount.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">AED</span>
                <span className="ml-2 text-sm font-medium text-chart-2">({downPaymentPercent}%)</span>
              </div>
            }
            footer={
              <>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber((purchasePrice * downPaymentValidation.minPercent) / 100)} AED</span>
                  <span>{formatNumber(purchasePrice * 0.8)} AED</span>
                </div>
                {!downPaymentValidation.valid && (
                  <p className="text-xs text-destructive mt-3">
                    Must be {downPaymentValidation.minPercent}%-{downPaymentValidation.maxPercent}% for {residencyStatus.replace('_', ' ')}
                  </p>
                )}
              </>
            }
          >
            <div className="relative px-2">
              <Slider value={[downPaymentPercent]} onValueChange={([v]) => setValue('downPaymentPercent', v)} min={downPaymentValidation.minPercent} max={80} step={1} className="w-full" />
            </div>
          </CalculatorCard>

          {/* Mortgage Loan Period */}
          <CalculatorCard
            title="Mortgage loan period"
            value={
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-chart-3">{mortgageYears}</span>
                <span className="text-muted-foreground text-sm">years</span>
              </div>
            }
            footer={
              <>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>25 years</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Monthly payment: <span className="font-medium text-foreground">{formatPrice(comparison.buy.monthlyMortgage)}</span>
                </p>
              </>
            }
          >
            <div className="relative px-2">
              <Slider value={[mortgageYears]} onValueChange={([v]) => setValue('mortgageYears', v)} min={1} max={25} step={1} className="w-full" />
            </div>
          </CalculatorCard>
        </div>

        {/* More Options - Interest Rate */}
        {showFees && (
          <div className="rounded-2xl border border-border bg-card/50 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-5">
              <h2 className="text-base font-bold text-foreground">Assumptions</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Adjust ownership costs, rental income, and appreciation for a fuller ROI view.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <CalculatorField label="Interest rate (%)">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 px-2">
                    <Slider value={[interestRate]} onValueChange={([v]) => setValue('interestRate', v)} min={2} max={12} step={0.25} className="w-full" />
                  </div>
                  <Input type="number" value={interestRate} {...register('interestRate', { valueAsNumber: true })} className="w-24 text-center" step={0.25} />
                </div>
              </CalculatorField>

              <CalculatorField label="Property size (sqft)">
                <Input type="number" value={propertySizeSqft} {...register('propertySizeSqft', { valueAsNumber: true })} />
              </CalculatorField>

              <CalculatorField label="Annual rental income">
                <Input type="number" value={annualRentalIncome} {...register('annualRentalIncome', { valueAsNumber: true })} />
              </CalculatorField>

              <CalculatorField label="Service charge per sqft">
                <Input type="number" value={serviceChargePerSqft} {...register('serviceChargePerSqft', { valueAsNumber: true })} />
              </CalculatorField>

              <CalculatorField label="Insurance (% of value)">
                <Input type="number" value={insurancePercent} {...register('insurancePercent', { valueAsNumber: true })} step={0.1} />
              </CalculatorField>

              <CalculatorField label="Maintenance reserve (%)">
                <Input type="number" value={maintenancePercent} {...register('maintenancePercent', { valueAsNumber: true })} step={0.1} />
              </CalculatorField>

              <CalculatorField label="Management fee (%)">
                <Input type="number" value={propertyManagementPercent} {...register('propertyManagementPercent', { valueAsNumber: true })} step={0.5} />
              </CalculatorField>

              <CalculatorField label="Vacancy allowance (%)">
                <Input type="number" value={vacancyPercent} {...register('vacancyPercent', { valueAsNumber: true })} step={0.5} />
              </CalculatorField>

              <CalculatorField label="Appreciation assumption (%)">
                <Input type="number" value={appreciationRate} {...register('appreciationRate', { valueAsNumber: true })} step={0.5} />
              </CalculatorField>
            </div>
          </div>
        )}

        {/* More Options Button */}
        <Button variant="outline" size="sm" onClick={() => setShowFees(!showFees)} className="w-full rounded-full">
          {showFees ? 'Less' : 'More'} options
        </Button>
      </div>

      {/* Right - Results (Sticky on desktop) */}
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 space-y-4">
        {/* Winner Card */}
        <div className={cn('p-6 rounded-2xl text-center transition-all duration-300', buyingIsBetter ? 'bg-primary/10 border-2 border-primary/20' : 'bg-chart-4/10 border-2 border-chart-4/20')}>
          <div className="flex justify-center mb-3">
            {buyingIsBetter ? (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                <Home className="w-6 h-6 text-chart-4" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{buyingIsBetter ? 'Save by buying' : 'Renting wins'}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{formatPrice(Math.abs(comparison.savedIfBuying))}</p>
          <p className="text-xs text-muted-foreground">over {comparison.years} years</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn('p-4 rounded-xl border transition-all duration-300', buyingIsBetter ? 'border-primary/30 bg-primary/5' : 'border-border bg-card')}>
            <p className="text-xs text-muted-foreground mb-1">Saved if buy</p>
            <p className="text-xl font-bold text-foreground">{formatPrice(Math.max(0, comparison.savedIfBuying))}</p>
          </div>
          <div className={cn('p-4 rounded-xl border transition-all duration-300', rentIsBetter ? 'border-chart-4/30 bg-chart-4/5' : 'border-border bg-card')}>
            <p className="text-xs text-muted-foreground mb-1">Lost if rent</p>
            <p className={cn('text-xl font-bold', comparison.savedIfBuying < 0 ? 'text-destructive' : 'text-foreground')}>{formatPrice(Math.abs(Math.min(0, comparison.savedIfBuying)))}</p>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Investment view</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Based on rental income, ownership costs, and appreciation.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/45 p-3">
              <p className="text-xs text-muted-foreground">Gross yield</p>
              <p className="mt-1 text-lg font-bold text-foreground">{tenYearRoi.grossYieldPercent.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-muted/45 p-3">
              <p className="text-xs text-muted-foreground">Net yield</p>
              <p className="mt-1 text-lg font-bold text-foreground">{tenYearRoi.netYieldPercent.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-muted/45 p-3">
              <p className="text-xs text-muted-foreground">10y ROI</p>
              <p className={cn('mt-1 text-lg font-bold', tenYearRoi.roiPercent >= 0 ? 'text-primary' : 'text-destructive')}>{tenYearRoi.roiPercent.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-muted/45 p-3">
              <p className="text-xs text-muted-foreground">10y profit</p>
              <p className={cn('mt-1 text-lg font-bold', tenYearRoi.netProfit >= 0 ? 'text-primary' : 'text-destructive')}>{formatPrice(tenYearRoi.netProfit)}</p>
            </div>
          </div>
        </div>

        {/* Breakeven */}
        {comparison.breakevenYear && (
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-xs text-foreground">
              <span className="font-semibold text-primary">Buy</span> beats <span className="font-semibold text-chart-4">rent</span> in <span className="font-bold">{comparison.breakevenYear}y</span>
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-lg">
          <button
            onClick={() => setShowBreakdown(true)}
            className={cn(
              'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
              showBreakdown ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Breakdown
          </button>
        </div>

        {/* Payment Breakdown (when shown) */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-2 px-3 font-semibold text-foreground"></th>
                  <th className="text-center py-2 px-2 font-semibold text-chart-4">Rent</th>
                  <th className="text-center py-2 px-2 font-semibold text-primary">Buy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Initial</td>
                  <td className="text-center py-2 px-2">{formatPrice(breakdown.rent.initialPayments)}</td>
                  <td className="text-center py-2 px-2">{formatPrice(breakdown.buy.initialPayments)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Recurring</td>
                  <td className="text-center py-2 px-2">{formatPrice(breakdown.rent.recurringPayments)}</td>
                  <td className="text-center py-2 px-2">{formatPrice(breakdown.buy.recurringPayments)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Service charges</td>
                  <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                  <td className="text-center py-2 px-2">{formatPrice(comparison.buy.annualServiceCharges)}/yr</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Insurance + maintenance</td>
                  <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                  <td className="text-center py-2 px-2">{formatPrice(comparison.buy.annualInsurance + comparison.buy.annualMaintenanceReserve)}/yr</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Net sale</td>
                  <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                  <td className="text-center py-2 px-2 text-emerald-600">+{formatPrice(breakdown.buy.netSalePrice)}</td>
                </tr>
                <tr className={cn('border-b-2', buyingIsBetter ? 'border-primary/30 bg-primary/5' : 'border-chart-4/30 bg-chart-4/5')}>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-2"></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-foreground">Net cost</td>
                  <td className={cn('text-center py-3 px-2 font-bold', rentIsBetter ? 'text-chart-4' : 'text-foreground')}>{formatPrice(breakdown.rent.netCost)}</td>
                  <td className={cn('text-center py-3 px-2 font-bold', buyingIsBetter ? 'text-primary' : 'text-foreground')}>{formatPrice(breakdown.buy.netCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Email-gated full ROI report */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <LockKeyhole className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Full ROI report</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Unlock the 1, 3, 5, and 10 year table with your email.</p>
            </div>
          </div>
          <CalculatorReportLeadForm
            calculatorName="True Cost Calculator"
            messageContext={reportContext}
            unlockedContent={
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="px-3 py-2 text-left font-bold text-foreground">Years</th>
                      <th className="px-2 py-2 text-right font-bold text-foreground">Net income</th>
                      <th className="px-2 py-2 text-right font-bold text-foreground">Value</th>
                      <th className="px-2 py-2 text-right font-bold text-foreground">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.roi.map((item) => (
                      <tr key={item.years} className="border-t border-border/70">
                        <td className="px-3 py-2 font-semibold text-foreground">{item.years}y</td>
                        <td className="px-2 py-2 text-right text-muted-foreground">{formatPrice(item.netRentalIncome)}</td>
                        <td className="px-2 py-2 text-right text-muted-foreground">{formatPrice(item.estimatedPropertyValue)}</td>
                        <td className={cn('px-2 py-2 text-right font-bold', item.roiPercent >= 0 ? 'text-primary' : 'text-destructive')}>{item.roiPercent.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="grid gap-2 border-t border-border bg-muted/35 p-3 text-xs leading-5 text-muted-foreground">
                  <p className="font-bold text-foreground">
                    Gross rental income: {formatPrice(tenYearRoi.grossRentalIncome)} over {tenYearRoi.years} years
                  </p>
                  <p>Net rental income deducts vacancy, management, service charges, insurance, and maintenance reserve. ROI uses upfront purchase costs as the capital base.</p>
                  <TrueCostReportPdfDownload data={reportData} />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
