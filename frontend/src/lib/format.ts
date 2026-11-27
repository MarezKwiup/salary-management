import { COUNTRIES, isCountryCode } from "./countries";

export function formatMoney(amount: number | null, country: string): string {
    if (amount === null) return '—';
    if (!isCountryCode(country)) return amount.toLocaleString();
    const { currency, locale } = COUNTRIES[country];
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}

export function formatDate(isoDate: string): string {
    return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

export function formatMoneyCompact(amount: number, country: string): string {
    if (!isCountryCode(country)) return amount.toLocaleString();
    const { currency } = COUNTRIES[country];
    return new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(amount);
}