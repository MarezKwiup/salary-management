import { describe, expect, it } from 'vitest';
import { PAGE_SIZE, parseListParams } from './employeeListParams';

const parse = (query: string) => parseListParams(new URLSearchParams(query));

describe('parseListParams', () => {
    it('uses defaults for an empty URL', () => {
        expect(parse('')).toEqual({
            search: undefined,
            country: undefined,
            department: undefined,
            sortBy: 'fullName',
            sortOrder: 'asc',
            page: 1,
            pageSize: PAGE_SIZE,
        });
    });

    it('reads valid values from the URL', () => {
        expect(
            parse('search=priya&country=IN&department=Sales&sortBy=salary&sortOrder=desc&page=3'),
        ).toMatchObject({
            search: 'priya',
            country: 'IN',
            department: 'Sales',
            sortBy: 'salary',
            sortOrder: 'desc',
            page: 3,
        });
    });

    it.each([
        ['country=XX', { country: undefined }],
        ['country=toString', { country: undefined }],
        ['department=Legal', { department: undefined }],
        ['sortBy=password', { sortBy: 'fullName' }],
        ['sortOrder=sideways', { sortOrder: 'asc' }],
        ['page=0', { page: 1 }],
        ['page=-2', { page: 1 }],
        ['page=1.5', { page: 1 }],
        ['page=abc', { page: 1 }],
    ])('falls back to a default for a hand-edited URL: %s', (query, expected) => {
        expect(parse(query)).toMatchObject(expected);
    });
});
