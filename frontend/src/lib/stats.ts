export function averageVsMedian(average: number | null, median: number | null): number | null {
    if (average === null || median === null || median === 0) return null;
    return Math.round(((average - median) / median) * 100);
}

export function formatGap(gap: number | null): string {
    if (gap === null) return '-';
    if (gap === 0) return 'Same';
    return `${gap > 0 ? '+' : ''}${gap}%`;
}