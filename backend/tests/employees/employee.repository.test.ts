import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { setupTestDb, resetDb } from '../helpers/testDb';
import { PgEmployeeRepository } from '../../src/employees/employee.repository';
import type { Db } from '../../src/db/client';
import type { NewEmployee } from '../../src/employees/employee.types';
import { ListEmployeesParams } from '../../src/employees/employee.validation';

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
    });

    it('returns false on non-existent id', async () => {
        const deleted = await repo.delete(999);
        expect(deleted).toBe(false);
    });
});

 
const base: NewEmployee = {
    fullName: 'Placeholder',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    country: 'IN',
    currency: 'INR',
    salary: 1_000_000,
    hireDate: '2024-01-01',
};

function seed(...overrides: Partial<NewEmployee>[]) {
    return overrides.reduce<Promise<void>>(
        (chain, override) =>
            chain.then(async () => void (await repo.create({ ...base, ...override }))),
        Promise.resolve(),
    );
}

const defaults: ListEmployeesParams = {
    sortBy: 'fullName',
    sortOrder: 'asc',
    limit: 20,
    offset: 0,
};

const names = (rows: { fullName: string }[]) => rows.map((row) => row.fullName);

describe('PgEmployeeRepository.list - filters', () => {
    beforeEach(async () => {
        await seed(
            { fullName: 'Aarav India Eng' },
            { fullName: 'Bela India Sales', department: 'Sales' },
            { fullName: 'Clara Germany Eng', country: 'DE', currency: 'EUR' },
            {
                fullName: 'Dieter Germany Sales',
                country: 'DE',
                currency: 'EUR',
                department: 'Sales',
            },
        );
    });

    it('filters by country', async () => {
        const { rows, total } = await repo.list({ ...defaults, country: 'DE' });
        expect(names(rows)).toEqual(['Clara Germany Eng', 'Dieter Germany Sales']);
        expect(total).toBe(2);
    });

    it('filters by department', async () => {
        const { rows } = await repo.list({ ...defaults, department: 'Sales' });
        expect(names(rows)).toEqual(['Bela India Sales', 'Dieter Germany Sales']);
    });

    it('combines country and department filters', async () => {
        const { rows, total } = await repo.list({
            ...defaults,
            country: 'DE',
            department: 'Sales'
        });
        expect(names(rows)).toEqual(['Dieter Germany Sales']);
        expect(total).toBe(1);
    });

    it('returns everyone when no filters are given', async () => {
        const { total } = await repo.list(defaults);
        expect(total).toBe(4);
    });
});

describe('PgEmployeeRepository.list - search', () => {
    beforeEach(async () => {
        await seed(
            { fullName: 'Priya Sharma' },
            { fullName: 'Rahul Verma' },
            { fullName: '100% Committed' },
            { fullName: '1000 Days' },
        );
    });

    it('is case-insensitive and matches part of a name', async () => {
        const { rows } = await repo.list({ ...defaults, search: 'SHAR' });
        expect(names(rows)).toEqual(['Priya Sharma']);
    });

    it('treats % as a literal character', async () => {
        const { rows } = await repo.list({ ...defaults, search: '%' });
        expect(names(rows)).toEqual(['100% Committed']);
    });

    it('treats _ as a literal character, not a wildcard', async () => {
        const { rows } = await repo.list({ ...defaults, search: '_' });
        expect(rows).toEqual([]);
    });
});

describe('PgEmployeeRepository.list - sorting', () => {
    beforeEach(async () => {
        await seed(
            { fullName: 'Low', salary: 100 },
            { fullName: 'Tie B', salary: 500 },
            { fullName: 'High', salary: 900 },
            { fullName: 'Tie A', salary: 500 },
        );
    });

    it('sorts by salary descending, breaking ties by id', async () => {
        const { rows } = await repo.list({ ...defaults, sortBy: 'salary', sortOrder: 'desc' });
        expect(names(rows)).toEqual(['High', 'Tie B', 'Tie A', 'Low']);
    });

    it('sorts by salary ascending, still breaking ties by id', async () => {
        const { rows } = await repo.list({ ...defaults, sortBy: 'salary', sortOrder: 'asc' });
        expect(names(rows)).toEqual(['Low', 'Tie B', 'Tie A', 'High']);
    });
});

describe('PgEmployeeRepository.list - pagination', () => {
    beforeEach(async () => {
        await seed(...[1, 2, 3, 4, 5].map((n) => ({ fullName: `Employee 0${n}` })));
    });

    it('returns the requested page and total across all pages', async () => {
        const { rows, total } = await repo.list({ ...defaults, limit: 2, offset: 2 });
        expect(names(rows)).toEqual(['Employee 03', 'Employee 04']);
        expect(total).toBe(5);
    });

    it('returns no rows but the correct total for page past end', async () => {
        const result = await repo.list({ ...defaults, limit: 2, offset: 10 });
        expect(result).toEqual({ rows: [], total: 5 });
    });

    it('returns total as a number, not a string', async () => {
        const { total } = await repo.list(defaults);
        expect(typeof total).toBe('number');
    });
})
