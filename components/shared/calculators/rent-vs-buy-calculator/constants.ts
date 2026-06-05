// lib/rent-vs-buy-calculator/constants.ts

/**
 * Dubai property fees - sourced from DLD and market standards
 * Last updated: 2026
 */
export const DUBAI_FEES = {
  // Buying fees
  /** Dubai Land Department transfer fee - 4% of property value */
  DLD_FEE_PERCENT: 4.0,

  /** Real estate agent commission for buying - typically 2% */
  AGENT_BUY_FEE_PERCENT: 2.0,

  /** Fixed registration fee */
  REGISTRATION_FEE: 3000,

  /** Registration Trustee fee - typically AED 1,000-1,500 */
  REGISTRATION_TRUSTEE_FEE: 1250,

  /** Property valuation fee - typically AED 2,500-3,500 */
  VALUATION_FEE: 3000,

  /** Mortgage processing fee - typically 0.25% of loan amount */
  MORTGAGE_PROCESSING_FEE_PERCENT: 0.25,

  /** Mortgage registration fee - 0.25% of loan amount */
  MORTGAGE_REGISTRATION_FEE_PERCENT: 0.25,

  // Renting fees
  /** Agent commission for renting - typically 5% of annual rent (one-time) */
  AGENT_RENT_FEE_PERCENT: 5.0,

  /** EJARI fee - roughly AED 220-300 per year */
  EJARI_FEE: 250,

  // Mortgage settings
  /** Default mortgage interest rate */
  DEFAULT_INTEREST_RATE: 4.5,

  /** Maximum mortgage term in years */
  MAX_MORTGAGE_YEARS: 25,

  /** Minimum mortgage term */
  MIN_MORTGAGE_YEARS: 1,

  /** Default property appreciation rate per year */
  APPRECIATION_RATE: 0.03, // 3% annually

  /** Default rent inflation rate per year */
  RENT_INFLATION_RATE: 0.02, // 2% annually

  /** Indicative annual service charge per sqft */
  SERVICE_CHARGE_PER_SQFT: 18,

  /** Indicative annual home insurance as % of property value */
  INSURANCE_PERCENT: 0.1,

  /** Indicative annual maintenance reserve as % of property value */
  MAINTENANCE_PERCENT: 1.0,

  /** Property management fee as % of rental income */
  PROPERTY_MANAGEMENT_PERCENT: 5.0,

  /** Vacancy allowance as % of rental income */
  VACANCY_PERCENT: 5.0,
} as const;

/**
 * Down payment requirements by residency status
 * UAE nationals: up to 80% LTV (20% down)
 * UAE residents: up to 80% LTV for first property, 70% for others
 * Non-residents: up to 60% LTV (40% down)
 */
export const DOWN_PAYMENT_REQUIREMENTS: Record<string, { minPercent: number; maxPercent: number }> = {
  uae_national: { minPercent: 20, maxPercent: 80 },
  uae_resident: { minPercent: 20, maxPercent: 80 },
  non_resident: { minPercent: 40, maxPercent: 60 },
} as const;
