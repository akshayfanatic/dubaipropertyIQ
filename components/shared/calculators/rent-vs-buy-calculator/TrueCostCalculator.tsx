'use client';

import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { calculateComparison, formatAED, formatNumber } from '@/components/shared/calculators/rent-vs-buy-calculator/calculator';
import { DUBAI_FEES } from '@/components/shared/calculators/rent-vs-buy-calculator/constants';
import { calculatorSchema, validateDownPayment, type CalculatorFormData } from '@/components/shared/calculators/rent-vs-buy-calculator/validation';
import { getPaymentBreakdown } from '@/components/shared/calculators/rent-vs-buy-calculator/calculator';
import type { ResidencyStatus } from '@/components/shared/calculators/rent-vs-buy-calculator/types';
import type { CityWithAreaCount } from '@/types/city';
import { cn } from '@/lib/utils';
import { TrendingDown, Home } from 'lucide-react';

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

export function TrueCostCalculator({ city, initialRent, initialPrice }: TrueCostCalculatorProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<CalculatorFormData>({
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
    },
  });

  const formValues = useWatch({
    control,
    name: ['annualRent', 'purchasePrice', 'residencyStatus', 'downPaymentPercent', 'mortgageYears', 'interestRate'],
  });

  const [annualRent, purchasePrice, residencyStatus, downPaymentPercent, mortgageYears, interestRate] = formValues;

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
          dldFeePercent: DUBAI_FEES.DLD_FEE_PERCENT,
          agentBuyFeePercent: DUBAI_FEES.AGENT_BUY_FEE_PERCENT,
          agentRentFeePercent: DUBAI_FEES.AGENT_RENT_FEE_PERCENT,
        },
        25,
      ),
    [annualRent, purchasePrice, residencyStatus, downPaymentPercent, mortgageYears, interestRate],
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left - Inputs */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* Input Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Annual Rent Card */}
          <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <label className="font-semibold text-foreground block mb-4">Annual rent</label>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-primary">{formatNumber(annualRent)}</span>
              <span className="text-muted-foreground">AED</span>
            </div>
            <div className="relative px-2">
              <Slider value={[annualRent]} onValueChange={([v]) => setValue('annualRent', v)} min={20000} max={2000000} step={10000} className="w-full" />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>{formatNumber(20000)} AED</span>
              <span>{formatNumber(2000000)} AED</span>
            </div>
            <Input type="number" value={annualRent} {...register('annualRent', { valueAsNumber: true })} className="mt-4" />
          </div>

          {/* Purchase Price Card */}
          <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <label className="font-semibold text-foreground block mb-4">Purchase price</label>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-primary">{formatNumber(purchasePrice)}</span>
              <span className="text-muted-foreground">AED</span>
            </div>
            <div className="relative px-2">
              <Slider value={[purchasePrice]} onValueChange={([v]) => setValue('purchasePrice', v)} min={300000} max={20000000} step={50000} className="w-full" />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>{formatNumber(300000)} AED</span>
              <span>{formatNumber(20000000)} AED</span>
            </div>
            <Input type="number" value={purchasePrice} {...register('purchasePrice', { valueAsNumber: true })} className="mt-4" />
          </div>
        </div>

        {/* Residency Status - Full Width */}
        <div className="p-6 rounded-2xl border border-border bg-card mb-6">
          <label className="font-semibold text-foreground block mb-2">Residency status</label>
          <p className="text-sm text-muted-foreground mb-4">It can impact down payment requirements when getting a mortgage.</p>
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
        </div>

        {/* Down Payment & Mortgage Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Down Payment */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <label className="font-semibold text-foreground block mb-2">Down Payment</label>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-chart-2">{downPaymentAmount.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm">AED</span>
              <span className="ml-2 text-sm font-medium text-chart-2">({downPaymentPercent}%)</span>
            </div>
            <div className="relative px-2">
              <Slider value={[downPaymentPercent]} onValueChange={([v]) => setValue('downPaymentPercent', v)} min={downPaymentValidation.minPercent} max={80} step={1} className="w-full" />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>{formatNumber((purchasePrice * downPaymentValidation.minPercent) / 100)} AED</span>
              <span>{formatNumber(purchasePrice * 0.8)} AED</span>
            </div>
            {!downPaymentValidation.valid && (
              <p className="text-xs text-destructive mt-3">
                Must be {downPaymentValidation.minPercent}%-{downPaymentValidation.maxPercent}% for {residencyStatus.replace('_', ' ')}
              </p>
            )}
          </div>

          {/* Mortgage Loan Period */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <label className="font-semibold text-foreground block mb-2">Mortgage loan period</label>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-chart-3">{mortgageYears}</span>
              <span className="text-muted-foreground text-sm">years</span>
            </div>
            <div className="relative px-2">
              <Slider value={[mortgageYears]} onValueChange={([v]) => setValue('mortgageYears', v)} min={1} max={25} step={1} className="w-full" />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>1 year</span>
              <span>25 years</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Monthly payment: <span className="font-medium text-foreground">{formatAED(comparison.buy.monthlyMortgage)}</span>
            </p>
          </div>
        </div>

        {/* More Options - Interest Rate */}
        {showFees && (
          <div className="p-6 rounded-2xl border border-border bg-card/50 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="font-semibold text-foreground block mb-4">Interest Rate (%)</label>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative px-2 flex-1">
                <Slider value={[interestRate]} onValueChange={([v]) => setValue('interestRate', v)} min={2} max={12} step={0.25} className="w-full" />
              </div>
              <Input type="number" value={interestRate} {...register('interestRate', { valueAsNumber: true })} className="w-24 text-center" step={0.25} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2%</span>
              <span>12%</span>
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
          <p className="text-3xl font-bold text-foreground mb-1">{formatAED(Math.abs(comparison.savedIfBuying))}</p>
          <p className="text-xs text-muted-foreground">over {comparison.years} years</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn('p-4 rounded-xl border transition-all duration-300', buyingIsBetter ? 'border-primary/30 bg-primary/5' : 'border-border bg-card')}>
            <p className="text-xs text-muted-foreground mb-1">Saved if buy</p>
            <p className="text-xl font-bold text-foreground">{formatAED(Math.max(0, comparison.savedIfBuying))}</p>
          </div>
          <div className={cn('p-4 rounded-xl border transition-all duration-300', rentIsBetter ? 'border-chart-4/30 bg-chart-4/5' : 'border-border bg-card')}>
            <p className="text-xs text-muted-foreground mb-1">Lost if rent</p>
            <p className={cn('text-xl font-bold', comparison.savedIfBuying < 0 ? 'text-destructive' : 'text-foreground')}>{formatAED(Math.abs(Math.min(0, comparison.savedIfBuying)))}</p>
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
                  <td className="text-center py-2 px-2">{formatAED(breakdown.rent.initialPayments)}</td>
                  <td className="text-center py-2 px-2">{formatAED(breakdown.buy.initialPayments)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Recurring</td>
                  <td className="text-center py-2 px-2">{formatAED(breakdown.rent.recurringPayments)}</td>
                  <td className="text-center py-2 px-2">{formatAED(breakdown.buy.recurringPayments)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-muted-foreground">Net sale</td>
                  <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                  <td className="text-center py-2 px-2 text-emerald-600">+{formatAED(breakdown.buy.netSalePrice)}</td>
                </tr>
                <tr className={cn('border-b-2', buyingIsBetter ? 'border-primary/30 bg-primary/5' : 'border-chart-4/30 bg-chart-4/5')}>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-2"></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-foreground">Net cost</td>
                  <td className={cn('text-center py-3 px-2 font-bold', rentIsBetter ? 'text-chart-4' : 'text-foreground')}>{formatAED(breakdown.rent.netCost)}</td>
                  <td className={cn('text-center py-3 px-2 font-bold', buyingIsBetter ? 'text-primary' : 'text-foreground')}>{formatAED(breakdown.buy.netCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
