/**
 * Mortgage Calculator Types
 */

export interface MortgageInputs {
  propertyValue: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
}

export interface MortgageResults {
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalAmount: number;
  loanAmount: number;
  downPayment: number;
}

export interface AmortizationYear {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}
