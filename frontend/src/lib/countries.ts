export const COUNTRIES = {
    IN: { name: 'India', currency: 'INR', locale: 'en-IN' },
    US: { name: 'United States', currency: 'USD', locale: 'en-US' },
    GB: { name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
    DE: { name: 'Germany', currency: 'EUR', locale: 'de-DE' },
    CA: { name: 'Canada', currency: 'CAD', locale: 'en-CA' },
    AU: { name: 'Australia', currency: 'AUD', locale: 'en-AU' },
    SG: { name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
    JP: { name: 'Japan', currency: 'JPY', locale: 'ja-JP' },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export const DEPARTMENTS = [
    'Engineering',
    'Product',
    'Design',
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'Operations',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export function isCountryCode(value: string): value is CountryCode {
    return value in COUNTRIES;
}
