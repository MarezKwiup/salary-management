import { describe, expect, it } from 'vitest';
import { toSearchParams } from './employees';

describe('toSearchParams', () => {
    it('includes set values and leaves out empty ones', () => {
        const params = toSearchParams({
            search: '',
            country: 'IN',
            department: undefined,
            sortBy: 'salary',
            sortOrder: 'desc',
            page: 2,
            pageSize: 20,
        });

        expect(params.toString()).toBe(
            'country=IN&sortBy=salary&sortOrder=desc&page=2&pageSize=20',
        );
    });
});