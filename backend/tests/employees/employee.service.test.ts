import { InMemoryEmployeeRepository } from '../fakes/InMemoryEmployeeRepository';
import { EmployeeService } from '../../src/employees/employee.service';
import { beforeEach, expect, describe, it } from 'vitest';
import type { CreateEmployeeInput } from '../../src/employees/employee.validation';
import { CountryCode } from '../../src/employees/countries';
import { NotFoundError } from '../../src/errors';

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

async function seed(country: CountryCode = "IN") {
    return service.create({ ...validInput, country });
}

describe('EmployeeService.update', () => {
    it('re-derives currency when country changes', async () => {
        const emp = await seed('IN');
        const updated = await service.update(emp.id, { country: 'DE'});

        expect(updated.country).toBe('DE');
        expect(updated.currency).toBe('EUR');
    });

    it('leaves currency alone when country is not changed', async () => {
        const emp = await seed('IN');
        const updated = await service.update(emp.id, { fullName: 'Priyanka' });

        expect(updated.currency).toBe('INR');
        expect(updated.country).toBe('IN');
        expect(updated.fullName).toBe('Priyanka');
    });
});

describe('missing id', () => {
    it.each(['getById', 'update', 'delete'] as const)('%s throws NotFoundError', async (method) => {
        await expect(service[method](999, { fullName: "Priyanka" })).rejects.toBeInstanceOf(NotFoundError);
    });
});
