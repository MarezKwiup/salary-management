export const COUNTRIES = {
  IN: { name: 'India', currency: 'INR' },
  US: { name: 'United States', currency: 'USD' },
  GB: { name: 'United Kingdom', currency: 'GBP' },
  DE: { name: 'Germany', currency: 'EUR' },
  CA: { name: 'Canada', currency: 'CAD' },
  AU: { name: 'Australia', currency: 'AUD' },
  SG: { name: 'Singapore', currency: 'SGD' },
  JP: { name: 'Japan', currency: 'JPY' },
} as const;

export type CountryCode = keyof typeof COUNTRIES;
export const COUNTRY_CODES = Object.keys(COUNTRIES) as [CountryCode, ...CountryCode[]];
export function currencyFor(code: CountryCode) {
  return COUNTRIES[code].currency;
}
