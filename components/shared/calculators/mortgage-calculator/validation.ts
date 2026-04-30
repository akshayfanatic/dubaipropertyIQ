/**
 * Mortgage Calculator Validation
 */

import * as z from 'zod';
import { MORTGAGE_CONSTANTS } from './constants';

export const mortgageSchema = z.object({
  propertyValue: z.number().min(MORTGAGE_CONSTANTS.MIN_PROPERTY_VALUE, 'Property value too low'),
  downPaymentPercent: z.number().min(MORTGAGE_CONSTANTS.MIN_DOWN_PAYMENT).max(MORTGAGE_CONSTANTS.MAX_DOWN_PAYMENT),
  interestRate: z.number().min(0.5).max(15),
  loanTerm: z.number().min(MORTGAGE_CONSTANTS.MIN_LOAN_TERM).max(MORTGAGE_CONSTANTS.MAX_LOAN_TERM),
});

export type MortgageFormData = z.infer<typeof mortgageSchema>;

export function validateDownPayment(percent: number): { valid: boolean; minPercent: number; maxPercent: number } {
  const minPercent = MORTGAGE_CONSTANTS.MIN_DOWN_PAYMENT;
  const maxPercent = MORTGAGE_CONSTANTS.MAX_DOWN_PAYMENT;

  return {
    valid: percent >= minPercent && percent <= maxPercent,
    minPercent,
    maxPercent,
  };
}
