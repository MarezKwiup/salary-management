import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { resetDb, setupTestDb } from '../helpers/testDb';
import { PgEmployeeRepository } from '../../src/employees/employee.repository';
import { PgInsightsRepository } from '../../src/insights/insights.repository';
import type { Db } from '../../src/db/client';
import type { NewEmployee } from '../../src/employees/employee.types';
import { desc } from 'drizzle-orm';

let db: Db;
let close: () => Promise<void>;
let employees: PgEmployeeRepository;
let insights: PgInsightsRepository;

beforeAll(async () => {
    ({ db, close } = await setupTestDb());
    employees = new PgEmployeeRepository(db);
    insights = new PgInsightsRepository(db);
});

beforeEach(async () => {
    await resetDb(db);
});

afterAll(async () => {
    await close();
});

const india: NewEmployee = {
    fullName: 'Employee',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    country: 'IN',
    currency: 'INR',
    salary: 100,
    hireDate: '2024-01-01',
};

const germany: NewEmployee = { ...india, country: 'DE', currency: 'EUR' };

async function seed(...rows: NewEmployee[]) {
    for (const row of rows) await employees.create(row);
}

describe('PgInsightsRepository.countryOverview', () => {
    it('returns one row per country, ordered by country code, never mixing currencies', async () => {
        await seed(
            { ...india, salary: 100 },
            { ...india, salary: 300 },
            { ...germany, salary: 5000 },
        );

        const overview = await insights.countryOverview();

        expect(overview).toEqual([
            {
                country: 'DE',
                currency: 'EUR',
                headcount: 1,
                minSalary: 5000,
                maxSalary: 5000,
                avgSalary: 5000,
                medianSalary: 5000,
            },
            {
                country: 'IN',
                currency: 'INR',
                headcount: 2,
                minSalary: 100,
                maxSalary: 300,
                avgSalary: 200,
                medianSalary: 200,
            },
        ]);
    });

    it('returns an empty list when there are no employees', async () => {
        expect(await insights.countryOverview()).toEqual([]);
    });
});

describe('PgInsightsRepository.countrySummary', () => {
    it('shows how an outlier pulls average but not median', async () => {
        await seed(
            { ...india, salary: 100 },
            { ...india, salary: 200 },
            { ...india, salary: 300 },
            { ...india, salary: 1000 },
        );

        expect(await insights.countrySummary('IN')).toEqual({
            headcount: 4,
            minSalary: 100,
            maxSalary: 1000,
            avgSalary: 400,
            medianSalary: 250,
        });
    });

    it('uses the middle value for an odd count', async () => {
        await seed({ ...india, salary: 100 }, { ...india, salary: 200 }, { ...india, salary: 900 });

        const summary = await insights.countrySummary('IN');

        expect(summary.medianSalary).toBe(200);
    });

    it('rounds average to whole number', async () => {
        await seed({ ...india, salary: 100 }, { ...india, salary: 101 });

        const summary = await insights.countrySummary('IN');

        expect(summary.avgSalary).toBe(101);
    });

    it('only includes requested country', async () => {
        await seed({ ...india, salary: 100 }, { ...germany, salary: 9999 });

        const summary = await insights.countrySummary('IN');

        expect(summary).toMatchObject({ headcount: 1, maxSalary: 100 });
    });

    it('returns headcount 0 and null stats for a country with no employees', async () => {
        await seed({ ...india });

        expect(await insights.countrySummary('JP')).toEqual({
            headcount: 0,
            minSalary: null,
            maxSalary: null,
            avgSalary: null,
            medianSalary: null,
        });
    });
});

describe('PgInsightsRepository.jobTitles', () => {
    it('groups by job title within country, highest average first', async () => {
        await seed(
            { ...india, jobTitle: 'Backend Engineer', salary: 100 },
            { ...india, jobTitle: 'Backend Engineer', salary: 300 },
            { ...india, jobTitle: 'Engineering Manager', salary: 900 },
            { ...germany, jobTitle: 'Backend Engineer', salary: 5000 },
        );

        const jobTitles = await insights.jobTitles('IN');

        expect(jobTitles).toEqual([
            {
                jobTitle: 'Engineering Manager',
                headcount: 1,
                minSalary: 900,
                maxSalary: 900,
                avgSalary: 900,
                medianSalary: 900,
            },
            {
                jobTitle: 'Backend Engineer',
                headcount: 2,
                minSalary: 100,
                maxSalary: 300,
                avgSalary: 200,
                medianSalary: 200,
            },
        ]);
    });

    it('returns an empty list for a country with no employees', async () => {
        await seed({ ...india });
        expect(await insights.jobTitles('JP')).toEqual([]);
    });
});

describe('PgInsightsRepository.departments', () => {
    it('groups by department with headcount, total and avg, highest total first', async () => {
        await seed(
            { ...india, department: 'Engineering', salary: 100 },
            { ...india, department: 'Engineering', salary: 300 },
            { ...india, department: 'Sales', salary: 1000 },
        );

        expect(await insights.departments('IN')).toEqual([
            { department: 'Sales', headcount: 1, totalSalary: 1000, avgSalary: 1000 },
            { department: 'Engineering', headcount: 2, totalSalary: 400, avgSalary: 200 },
        ]);
    });

    it('returns total above the integer limit correctly as numbers', async () => {
        await seed({ ...india, salary: 2_000_000_000 }, { ...india, salary: 2_000_000_000 });

        const [engineering] = await insights.departments('IN');

        expect(engineering?.totalSalary).toBe(4_000_000_000);
        expect(typeof engineering?.totalSalary).toBe('number');
    });

    it('returns an empty list for a country with no employees', async () => {
        await seed({ ...india });
        expect(await insights.departments('JP')).toEqual([]);
    });
});
