import { file } from 'zod';
import {
    createEmployeeSchema,
    listEmployeesQuerySchema,
} from '../../src/employees/employee.validation';
import { describe, it, expect } from 'vitest';
import { fa } from 'zod/v4/locales';

describe('Create employee schema validation', () => {
    let validEmployee = {
        fullName: ' Priya Sharma ',
        jobTitle: 'Backend Engineer',
        department: 'Engineering',
        country: 'in',
        salary: 1800000,
        hireDate: '2024-03-15',
    };
    it('accepts valid input and trims whitespace from names', () => {
        const result = createEmployeeSchema.safeParse(validEmployee);
        expect(result.success).toBe(true);
        expect(result.data).toEqual({ ...validEmployee, country: 'IN', fullName: 'Priya Sharma' });
    });

    it('rejects an empty or whitespace only fullName', () => {
        const whitespaceFullName = { ...validEmployee, fullName: '   ' };

        const result = createEmployeeSchema.safeParse(whitespaceFullName);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.path).toEqual(['fullName']);
    });

    it('rejects non positive non integer values for salary', () => {
        const zeroSalary = { ...validEmployee, salary: 0 };
        const nonIntegerSalary = { ...validEmployee, salary: 500000.5 };
        const stringSalary = { ...validEmployee, salary: '500000' };
        for (const errorObject of [zeroSalary, nonIntegerSalary, stringSalary]) {
            const result = createEmployeeSchema.safeParse(errorObject);
            expect(result.success).toBe(false);
            expect(result.error?.issues[0]?.path).toEqual(['salary']);
        }
    });

    it('rejects unsupported country "XX"', () => {
        const invalidCountry = { ...validEmployee, country: 'XX' };
        const result = createEmployeeSchema.safeParse(invalidCountry);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.path).toEqual(['country']);
    });

    it('rejects invalid date formats', () => {
        const invalidDate = { ...validEmployee, hireDate: '2024-02-30' };
        const res = createEmployeeSchema.safeParse(invalidDate);
        expect(res.success).toBe(false);
        expect(res.error?.issues[0]?.path).toEqual(['hireDate']);
    });

    it('drops currency field sent by client', () => {
        const currencySent = { ...validEmployee, currency: 'INR' };
        const res = createEmployeeSchema.safeParse(currencySent);
        expect(res.success).toBe(true);
        expect(res.data).not.toHaveProperty('currency');
    });

    it('rejects unknown departments', () => {
        const invalidDepartment = { ...validEmployee, department: 'unknow' };
        const res = createEmployeeSchema.safeParse(invalidDepartment);
        expect(res.success).toBe(false);
        expect(res.error?.issues[0]?.path).toEqual(['department']);
    });
});

describe('listEmployeesQuerySchema', () => {
    it('applies defaults when the query string is empty', () => {
        expect(listEmployeesQuerySchema.parse({})).toEqual({
            page: 1,
            pageSize: 20,
            sortBy: 'fullName',
            sortOrder: 'asc',
        });
    });

    it('converts query-string values and normalises country', () => {
        const result = listEmployeesQuerySchema.parse({ page: '2', pageSize: '50', country: 'in' });
        expect(result).toMatchObject({ page: 2, pageSize: 50, country: 'IN' });
    });

    it.each([
        ['pageSize', '101'],
        ['pageSize', '0'],
        ['page', '0'],
        ['page', '1.5'],
        ['sortBy', 'password'],
        ['sortOrder', 'sideways'],
        ['country', 'XX'],
        ['department', 'Legal'],
    ])('rejects %s=%s', (field, value) => {
        const result = listEmployeesQuerySchema.safeParse({ [field]: value });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.path).toEqual([field]);
    });
});
