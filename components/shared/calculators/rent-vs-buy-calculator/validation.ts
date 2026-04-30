// lib/rent-vs-buy-calculator/validation.ts

import { z } from 'zod';
import { DOWN_PAYMENT_REQUIREMENTS } from './constants';

export const calculatorSchema = z.object({
  annualRent: z.number().positive('Annual rent must be positive').max(10_000_000, 'Rent seems too high'),
  purchasePrice: z.number().positive('Purchase price must be positive').max(100_000_000, 'Price seems too high'),
  residencyStatus: z.enum(['uae_national', 'uae_resident', 'non_resident']),
  downPaymentPercent: z.number().min(5, 'Down payment minimum is 5%').max(80, 'Down payment maximum is 80%'),
  mortgageYears: z.number().int().min(1, 'Minimum 1 year').max(25, 'Maximum 25 years'),
  interestRate: z.number().min(0.1, 'Interest rate too low').max(15, 'Interest rate too high'),
  // Optional fee overrides
  dldFeePercent: z.number().min(0).max(20).default(4.0).optional(),
  agentBuyFeePercent: z.number().min(0).max(20).default(2.0).optional(),
  agentRentFeePercent: z.number().min(0).max(20).default(5.0).optional(),
});

export type CalculatorFormData = z.infer<typeof calculatorSchema>;

/**
 * Validate down payment against residency requirements
 */
export function validateDownPayment(residencyStatus: string, downPaymentPercent: number): { valid: boolean; minPercent: number; maxPercent: number } {
  const requirements = DOWN_PAYMENT_REQUIREMENTS[residencyStatus];
  if (!requirements) {
    return { valid: true, minPercent: 20, maxPercent: 80 };
  }

  const valid = downPaymentPercent >= requirements.minPercent && downPaymentPercent <= requirements.maxPercent;
  return {
    valid,
    minPercent: requirements.minPercent,
    maxPercent: requirements.maxPercent,
  };
}
