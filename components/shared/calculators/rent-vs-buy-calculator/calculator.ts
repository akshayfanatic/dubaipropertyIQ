// lib/rent-vs-buy-calculator/calculator.ts

import { DUBAI_FEES } from './constants';
import type { CalculatorInputs, RentCalculation, BuyCalculation, ComparisonResult, PaymentBreakdown } from './types';

/**
 * Calculate monthly mortgage payment using standard formula
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculateMonthlyMortgage(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

  return principal * (numerator / denominator);
}

/**
 * Calculate costs for renting scenario
 */
function calculateRentCosts(annualRent: number, years: number, agentRentFeePercent: number, ejariFee: number, rentInflationRate: number): RentCalculation {
  const monthlyRent = annualRent / 12;
  const agentCommission = annualRent * (agentRentFeePercent / 100);

  // EJARI fee is paid yearly
  const totalEjariFees = ejariFee * years;

  // Rent increases each year due to inflation
  let totalRent = 0;
  let currentAnnualRent = annualRent;
  for (let i = 0; i < years; i++) {
    totalRent += currentAnnualRent;
    currentAnnualRent *= 1 + rentInflationRate;
  }

  const totalInitialCost = agentCommission;
  const totalRecurringCost = totalRent + totalEjariFees;

  return {
    monthlyRent,
    agentCommission,
    ejariFee,
    totalInitialCost,
    totalRecurringCost,
    netCostOverPeriod: totalInitialCost + totalRecurringCost,
  };
}

/**
 * Calculate costs for buying scenario
 */
function calculateBuyCosts(inputs: CalculatorInputs, years: number): BuyCalculation {
  const {
    purchasePrice,
    downPaymentPercent,
    mortgageYears,
    interestRate,
    dldFeePercent = DUBAI_FEES.DLD_FEE_PERCENT,
    agentBuyFeePercent = DUBAI_FEES.AGENT_BUY_FEE_PERCENT,
    registrationFee = DUBAI_FEES.REGISTRATION_FEE,
    registrationTrusteeFee = DUBAI_FEES.REGISTRATION_TRUSTEE_FEE,
    valuationFee = DUBAI_FEES.VALUATION_FEE,
  } = inputs;

  const mortgageProcessingFeePercent = DUBAI_FEES.MORTGAGE_PROCESSING_FEE_PERCENT;
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;

  // Mortgage is only for the mortgage term, after that only service charges
  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, interestRate, mortgageYears);
  const monthsWithMortgage = Math.min(mortgageYears * 12, years * 12);
  const monthsWithoutMortgage = years * 12 - monthsWithMortgage;

  const totalMortgagePayments = monthlyMortgage * monthsWithMortgage;

  // One-time fees
  const dldFee = purchasePrice * (dldFeePercent / 100);
  const agentCommission = purchasePrice * (agentBuyFeePercent / 100);
  const mortgageProcessingFee = loanAmount * (mortgageProcessingFeePercent / 100);
  const mortgageRegistrationFee = loanAmount * (DUBAI_FEES.MORTGAGE_REGISTRATION_FEE_PERCENT / 100);

  const totalInitialCost = downPayment + dldFee + agentCommission + registrationFee + registrationTrusteeFee + valuationFee + mortgageProcessingFee + mortgageRegistrationFee;

  // Recurring costs (mortgage only, service charges excluded for simplicity)
  const totalRecurringCost = totalMortgagePayments;

  // Net sale price after appreciation
  const appreciatedValue = purchasePrice * Math.pow(1 + DUBAI_FEES.APPRECIATION_RATE, years);
  const remainingLoan = Math.max(0, calculateRemainingLoan(loanAmount, interestRate, mortgageYears, years));
  const netSalePrice = appreciatedValue - remainingLoan;

  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    dldFee,
    agentCommission,
    registrationFee,
    registrationTrusteeFee,
    valuationFee,
    mortgageProcessingFee: mortgageProcessingFee + mortgageRegistrationFee,
    totalInitialCost,
    totalRecurringCost,
    netSalePrice,
    netCostOverPeriod: totalInitialCost + totalRecurringCost - netSalePrice,
  };
}

/**
 * Calculate remaining loan balance after n years
 */
function calculateRemainingLoan(principal: number, annualRate: number, loanTermYears: number, yearsElapsed: number): number {
  if (yearsElapsed >= loanTermYears) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const paymentsMade = yearsElapsed * 12;

  const remainingPayments = numberOfPayments - paymentsMade;

  // Formula for remaining balance: B = L * [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
  const numerator = Math.pow(1 + monthlyRate, numberOfPayments) - Math.pow(1 + monthlyRate, paymentsMade);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

  return principal * (numerator / denominator);
}

/**
 * Main comparison function
 */
export function calculateComparison(inputs: CalculatorInputs, years: number = 25): ComparisonResult {
  const { annualRent, purchasePrice, agentRentFeePercent = DUBAI_FEES.AGENT_RENT_FEE_PERCENT, ejariFee = DUBAI_FEES.EJARI_FEE } = inputs;

  const rent = calculateRentCosts(annualRent, years, agentRentFeePercent, ejariFee, DUBAI_FEES.RENT_INFLATION_RATE);

  const buy = calculateBuyCosts(inputs, years);

  const rentCost = rent.netCostOverPeriod;
  const buyCost = buy.netCostOverPeriod;

  const savedIfBuying = rentCost - buyCost;
  const savedIfRenting = buyCost - rentCost;

  let winner: 'rent' | 'buy' | 'tie';
  if (Math.abs(savedIfBuying) < 100) {
    winner = 'tie';
  } else if (savedIfBuying > 0) {
    winner = 'buy';
  } else {
    winner = 'rent';
  }

  // Find breakeven year
  let breakevenYear: number | null = null;
  if (winner !== 'rent') {
    for (let y = 1; y <= years; y++) {
      const rentAtYear = calculateRentCosts(annualRent, y, agentRentFeePercent, ejariFee, DUBAI_FEES.RENT_INFLATION_RATE);
      const buyAtYear = calculateBuyCosts(inputs, y);

      const rentCostAtYear = rentAtYear.netCostOverPeriod;
      const buyCostAtYear = buyAtYear.netCostOverPeriod;

      if (buyCostAtYear < rentCostAtYear) {
        breakevenYear = y;
        break;
      }
    }
  }

  return {
    rent,
    buy,
    years,
    savedIfBuying,
    savedIfRenting,
    breakevenYear,
    winner,
  };
}

/**
 * Get payment breakdown for display
 */
export function getPaymentBreakdown(comparison: ComparisonResult): {
  rent: PaymentBreakdown;
  buy: PaymentBreakdown;
} {
  return {
    rent: {
      initialPayments: comparison.rent.totalInitialCost,
      recurringPayments: comparison.rent.totalRecurringCost,
      netSalePrice: 0,
      netCost: comparison.rent.netCostOverPeriod,
    },
    buy: {
      initialPayments: comparison.buy.totalInitialCost,
      recurringPayments: comparison.buy.totalRecurringCost,
      netSalePrice: comparison.buy.netSalePrice,
      netCost: comparison.buy.netCostOverPeriod,
    },
  };
}

/**
 * Format currency in AED
 */
export function formatAED(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-AE').format(Math.round(amount));
}
