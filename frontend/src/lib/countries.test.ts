import { describe, expect, it } from 'vitest';
import { isCountryCode } from './countries';

describe('isCountryCode', () => {
    it.each(['IN', 'US', 'JP'])('accepts supported code %s', (code) => {
        expect(isCountryCode(code)).toBe(true);
    });

    it.each(['XX', 'in', ''])('rejects %j', (code) => {
        expect(isCountryCode(code)).toBe(false);
    });

    it.each(['toString', 'constructor', '__proto__'])(
        'rejects built-in object property %s',
        (code) => {
            expect(isCountryCode(code)).toBe(false);
        },
    );
});