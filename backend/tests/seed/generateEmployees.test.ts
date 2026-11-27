import { describe, expect, it } from 'vitest';
import { generateEmployees } from '../../src/seed/generateEmployees';
import { BASE_SALARY, ROLES, SALARY_VARIATION } from '../../src/seed/seedData';
import { COUNTRY_CODES, currencyFor, type CountryCode } from '../../src/employees/countries';
import { createEmployeeSchema, DEPARTMENTS } from '../../src/employees/employee.validation';

// Generated once and shared: the generator is pure, so tests can't affect each other.
const employees = generateEmployees(10_000);

describe('generateEmployees', () => {
    it('generates the requested number of employees', () => {
        expect(employees).toHaveLength(10_000);
        expect(generateEmployees(3)).toHaveLength(3);
    });

    it('is deterministic for the same seed', () => {
        expect(generateEmployees(50, 7)).toEqual(generateEmployees(50, 7));
    });

    it('produces different employees for a different seed', () => {
        expect(generateEmployees(50, 1)).not.toEqual(generateEmployees(50, 2));
    });

    it('only produces data the API itself would accept', () => {
        for (const employee of employees) {
            expect(createEmployeeSchema.safeParse(employee).success).toBe(true);
        }
    });

    it('always uses the currency of the employee’s country', () => {
        for (const employee of employees) {
            expect(employee.currency).toBe(currencyFor(employee.country as CountryCode));
        }
    });

    it('keeps salaries within the role’s range for the country, rounded to 1,000', () => {
        for (const employee of employees) {
            const role = ROLES.find((r) => r.jobTitle === employee.jobTitle);
            const expected = BASE_SALARY[employee.country as CountryCode] * role!.multiplier;

            expect(employee.salary % 1000).toBe(0);
            // ±500 allows for rounding to the nearest 1,000
            expect(employee.salary).toBeGreaterThanOrEqual(expected * (1 - SALARY_VARIATION) - 500);
            expect(employee.salary).toBeLessThanOrEqual(expected * (1 + SALARY_VARIATION) + 500);
        }
    });

    it('covers every supported country and department', () => {
        expect(new Set(employees.map((e) => e.country))).toEqual(new Set(COUNTRY_CODES));
        expect(new Set(employees.map((e) => e.department))).toEqual(new Set(DEPARTMENTS));
    });

    it('gives each job title exactly one department', () => {
        const departmentsByTitle = new Map<string, Set<string>>();
        for (const { jobTitle, department } of employees) {
            const set = departmentsByTitle.get(jobTitle) ?? new Set();
            departmentsByTitle.set(jobTitle, set.add(department));
        }
        for (const departments of departmentsByTitle.values()) {
            expect(departments.size).toBe(1);
        }
    });
});
