import { describe, expect, it } from 'vitest';
import { ApiError } from './client';
import { fieldErrorsFrom } from './errors';

describe('fieldErrorsFrom', () => {
    it('maps a validation error to field messages', () => {
        const error = new ApiError(400, {
            error: 'VALIDATION_ERROR',
            issues: [
                { path: 'fullName', message: 'Too long' },
                { path: 'salary', message: 'Must be positive' },
            ],
        });

        expect(fieldErrorsFrom(error)).toEqual({
            fullName: 'Too long',
            salary: 'Must be positive',
        });
    });

    it.each([
        ['a 400 that is not a validation error', new ApiError(400, { error: 'INVALID_JSON' })],
        ['a 500', new ApiError(500, { error: 'INTERNAL_ERROR' })],
        ['a 400 with no body', new ApiError(400, null)],
        ['a network failure', new TypeError('Failed to fetch')],
    ])('returns null for %s', (_label, error) => {
        expect(fieldErrorsFrom(error)).toBeNull();
    });
});