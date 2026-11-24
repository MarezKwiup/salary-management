import { InMemoryEmployeeRepository } from '../fakes/InMemoryEmployeeRepository';
import { EmployeeService } from '../../src/employees/employee.service';
import { beforeEach, expect, describe, it } from 'vitest';
import type { CreateEmployeeInput } from '../../src/employees/employee.validation';

let service: EmployeeService;

beforeEach(() => {
    service = new EmployeeService(new InMemoryEmployeeRepository());
});

const validInput: CreateEmployeeInput = {
    fullName: 'Priya Sharma',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    country: 'IN',
    salary: 1800000,
    hireDate: '2024-03-15',
};

describe('EmployeeService.create', () => {
    it('returns the saved employee with a generated id', async () => {
        const emp = await service.create({ ...validInput, country: 'JP' });

        expect(emp.id).toBe(1);
        expect(emp.currency).toBe('JPY');
        expect(emp.createdAt).toBeInstanceOf(Date);
    });

    it.each([
        ['IN', 'INR'],
        ['DE', 'EUR'],
        ['JP', 'JPY'],
    ] as const)('derives currency for %s as %s', async (country, currency) => {
        const emp = await service.create({ ...validInput, country });
        expect(emp.currency).toBe(currency);
    });
});
