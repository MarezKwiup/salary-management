import { createEmployeeSchema } from '../../src/employees/employee.validation';
import { describe, it, expect } from 'vitest';

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
