import { describe, expect, it } from 'vitest';
import type { Employee } from '../../api/types';
import {
    employeeFormValidation as validate,
    toEmployeeInput,
    toFormValues,
    type EmployeeFormValues,
} from './employeeForm';

describe('employee form validation', () => {
    it.each(['', '   '])('requires a name (%j)', (value) => {
        expect(validate.fullName(value)).toBe('Name is required');
    });

    it.each([0, -5, 1.5, ''] as const)('rejects salary %j', (value) => {
        expect(validate.salary(value)).toBe('Enter a whole number above 0');
    });

    it('accepts a positive whole salary', () => {
        expect(validate.salary(1_800_000)).toBeNull();
    });

    it('requires a country and department to be picked', () => {
        expect(validate.country('')).toBe('Pick a country');
        expect(validate.department('')).toBe('Pick a department');
    });
});

describe('toEmployeeInput', () => {
    it('trims text fields and never sends a currency', () => {
        const values: EmployeeFormValues = {
            fullName: '  Priya Sharma ',
            jobTitle: ' Backend Engineer ',
            department: 'Engineering',
            country: 'IN',
            salary: 1_800_000,
            hireDate: '2024-03-15',
        };

        const input = toEmployeeInput(values);

        expect(input).toEqual({
            fullName: 'Priya Sharma',
            jobTitle: 'Backend Engineer',
            department: 'Engineering',
            country: 'IN',
            salary: 1_800_000,
            hireDate: '2024-03-15',
        });
        expect(input).not.toHaveProperty('currency');
    });
});

describe('toFormValues', () => {
    it('copies only the editable fields of an employee', () => {
        const employee: Employee = {
            id: 7,
            fullName: 'Priya Sharma',
            jobTitle: 'Backend Engineer',
            department: 'Engineering',
            country: 'IN',
            currency: 'INR',
            salary: 1_800_000,
            hireDate: '2024-03-15',
            createdAt: '2024-03-15T00:00:00Z',
            updatedAt: '2024-03-15T00:00:00Z',
        };

        expect(toFormValues(employee)).toEqual({
            fullName: 'Priya Sharma',
            jobTitle: 'Backend Engineer',
            department: 'Engineering',
            country: 'IN',
            salary: 1_800_000,
            hireDate: '2024-03-15',
        });
    });
});