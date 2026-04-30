// lib/rent-vs-buy-calculator/types.ts

/** Residency status affects mortgage down payment requirements */
export type ResidencyStatus = 'uae_national' | 'uae_resident' | 'non_resident';

export interface CalculatorInputs {
  // Property basics
  annualRent: number;
  purchasePrice: number;

  // Mortgage settings
  residencyStatus: ResidencyStatus;
  downPaymentPercent: number;
  mortgageYears: number;
  interestRate: number;

  // Property fees (optional overrides)
  dldFeePercent?: number;
  agentBuyFeePercent?: number;
  agentRentFeePercent?: number;
  registrationFee?: number;
  registrationTrusteeFee?: number;
  valuationFee?: number;
  mortgageProcessingFee?: number;
  ejariFee?: number;
}

export interface RentCalculation {
  monthlyRent: number;
  agentCommission: number; // One-time, typically 5% of annual rent
  ejariFee: number; // Yearly
  totalInitialCost: number;
  totalRecurringCost: number;
  netCostOverPeriod: number;
}

export interface BuyCalculation {
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  dldFee: number;
  agentCommission: number;
  registrationFee: number;
  registrationTrusteeFee: number;
  valuationFee: number;
  mortgageProcessingFee: number;
  totalInitialCost: number;
  totalRecurringCost: number;
  netSalePrice: number; // After assumed appreciation
  netCostOverPeriod: number;
}

export interface ComparisonResult {
  rent: RentCalculation;
  buy: BuyCalculation;
  years: number;
  savedIfBuying: number; // Positive = buying cheaper
  savedIfRenting: number; // Positive = renting cheaper
  breakevenYear: number | null; // Year when buy becomes better
  winner: 'rent' | 'buy' | 'tie';
}

export interface PaymentBreakdown {
  initialPayments: number;
  recurringPayments: number;
  netSalePrice: number;
  netCost: number;
}
