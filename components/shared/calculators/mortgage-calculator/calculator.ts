/**
 * Mortgage Calculator Functions
 */

import type { MortgageInputs, MortgageResults, AmortizationYear } from './types';

const DEFAULT_INTEREST_RATE = 4.5; // UAE average rate

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const { propertyValue, downPaymentPercent, interestRate = DEFAULT_INTEREST_RATE, loanTerm } = inputs;

  const downPayment = (propertyValue * downPaymentPercent) / 100;
  const loanAmount = propertyValue - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const totalAmount = monthlyPayment * numberOfPayments;
  const totalPrincipal = loanAmount;
  const totalInterest = totalAmount - totalPrincipal;

  return {
    monthlyPayment,
    totalPrincipal,
    totalInterest,
    totalAmount,
    loanAmount,
    downPayment,
  };
}

export function generateAmortizationSchedule(inputs: MortgageInputs): AmortizationYear[] {
  const { propertyValue, downPaymentPercent, interestRate = DEFAULT_INTEREST_RATE, loanTerm } = inputs;

  const downPayment = (propertyValue * downPaymentPercent) / 100;
  const loanAmount = propertyValue - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const schedule: AmortizationYear[] = [];
  let balance = loanAmount;

  for (let year = 1; year <= loanTerm; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let month = 1; month <= 12; month++) {
      const paymentNumber = (year - 1) * 12 + month;
      if (paymentNumber > numberOfPayments) break;

      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;

      yearInterest += interestPayment;
      yearPrincipal += principalPayment;
      balance -= principalPayment;

      if (balance < 0) balance = 0;
    }

    schedule.push({
      year,
      principal: yearPrincipal,
      interest: yearInterest,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
}

export function formatAED(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-AE').format(num);
}
