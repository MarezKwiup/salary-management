import { describe, expect, it } from 'vitest';
import { formatDate, formatMoney, formatMoneyCompact } from './format';

describe('formatMoney', () => {
    it.each([
        ['IN', 1829000, '₹18,29,000'], // Indian lakh grouping
        ['US', 123000, '$123,000'],
        ['GB', 66000, '£66,000'],
        ['DE', 71000, '71.000 €'],
        ['CA', 96000, 'CA$96,000'], // not a bare "$" that reads as US dollars
        ['AU', 110000, 'A$110,000'],
        ['SG', 93500, 'SGD 93,500'],
    ])('formats %s %d as %s', (country, amount, expected) => {
        // Intl uses a non-breaking space in some formats; normalise for comparison
        expect(formatMoney(amount, country).replace(/ /g, ' ')).toBe(expected);
    });

    it('shows a dash for a missing value', () => {
        expect(formatMoney(null, 'IN')).toBe('—');
    });

    it('rounds to whole currency units', () => {
        expect(formatMoney(1999.6, 'US')).toBe('$2,000');
    });
});

describe('formatMoneyCompact', () => {
    it('shortens large amounts for chart axes', () => {
        expect(formatMoneyCompact(3_200_000_000, 'IN')).toBe('₹3.2B');
        expect(formatMoneyCompact(800_000, 'US')).toBe('$800K');
    });
});

describe('formatDate', () => {
    it('formats an ISO date without shifting it across time zones', () => {
        expect(formatDate('2024-01-01')).toBe('1 Jan 2024');
    });
});