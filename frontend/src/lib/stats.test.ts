import { describe, expect, it } from 'vitest';
import { averageVsMedian, formatGap } from './stats';

describe('averageVsMedian', () => {
    it('returns how far the average is above the median, in percent', () => {
        expect(averageVsMedian(110, 100)).toBe(10);
    });

    it('is negative when the average is below the median', () => {
        expect(averageVsMedian(90, 100)).toBe(-10);
    });

    it('rounds to a whole percentage', () => {
        expect(averageVsMedian(1979466, 1829000)).toBe(8);
    });

    it.each([
        [null, 100],
        [100, null],
        [100, 0],
    ])('returns null when it cannot be computed (avg %s, median %s)', (average, median) => {
        expect(averageVsMedian(average, median)).toBeNull();
    });
});

describe('formatGap', () => {
    it.each([
        [8, '+8%'],
        [-5, '-5%'],
        [0, 'Same'],
        [null, '—'],
    ])('formats %s as %s', (gap, expected) => {
        expect(formatGap(gap)).toBe(expected);
    });
});
