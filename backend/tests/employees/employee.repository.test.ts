import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { setupTestDb, resetDb } from '../helpers/testDb';
import { PgEmployeeRepository } from '../../src/employees/employee.repository';
import type { Db } from '../../src/db/client';
import type { NewEmployee } from '../../src/employees/employee.types';

let db: Db;
let close: () => Promise<void>;
let repo: PgEmployeeRepository;

const newEmployee: NewEmployee = {
    fullName: 'Priya Sharma',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    country: 'IN',
    currency: 'INR',
    salary: 1800000,
    hireDate: '2024-01-01',
};

beforeAll(async () => {
    ({ db, close } = await setupTestDb());
    repo = new PgEmployeeRepository(db);
});

beforeEach(async () => {
    await resetDb(db);
});

afterAll(async () => {
    await close?.();
});

describe('PgEmployeeRepository.create', () => {
    it('persists an employee and returns stored row', async () => {
        const emp = await repo.create(newEmployee);

        expect(emp.id).toBe(1);
        expect(emp.createdAt).toBeInstanceOf(Date);
        expect(emp.hireDate).toBe('2024-01-01');
        expect(emp).toMatchObject(newEmployee);
    });

    it('database rejects salary of 0', async () => {
        await expect(repo.create({ ...newEmployee, salary: 0 })).rejects.toMatchObject({
            cause: { code: '23514', constraint: 'employees_salary_positive' },
        });
    });
});

describe('PgEmployeeRepository.update', () => {
    it('changes only given fiels and moves updatedAt forward', async () => {
        const created = await repo.create(newEmployee);
        await new Promise((r) => setTimeout(r, 5));

        const updated = await repo.update(created.id, { jobTitle: 'Staff Engineer' });

        expect(updated).not.toBeNull();
        expect(updated?.jobTitle).toBe('Staff Engineer');
        expect(updated?.fullName).toBe(created.fullName);
        expect(updated?.salary).toBe(created.salary);
        expect(updated?.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    it('returns null for a missing id', async () => {
        const updated = await repo.update(999, { jobTitle: 'Staff Engineer' });
        expect(updated).toBeNull();
    });
});

describe('PgEmployeeRepository.findById', () => {
    it('returns employee found', async () => {
        const created = await repo.create(newEmployee);

        const emp = await repo.findById(created.id);
        expect(emp).not.toBeNull();
        expect(emp?.jobTitle).toBe(created.jobTitle);
        expect(emp?.fullName).toBe(created.fullName);
        expect(emp?.salary).toBe(created.salary);
    })

    it('returns null on id not found', async () => {
        const emp = await repo.findById(999);
        expect(emp).toBeNull();
    })
})

describe('PgEmployeeRepository.delete', () => {
    it('successfully deletes existing employees', async () => {
        const created = await repo.create(newEmployee);

        const deleted = await repo.delete(created.id);
        expect(deleted).toBe(true);
    })

    it('returns false on non-existent id', async () => {
        const deleted = await repo.delete(999);
        expect(deleted).toBe(false);
    })
})
