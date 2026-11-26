import type { CountryCode } from "../employees/countries";
import type { DEPARTMENTS } from '../employees/employee.validation';

type Department = (typeof DEPARTMENTS)[number];

export const BASE_SALARY: Record<CountryCode, number> = {
    IN: 1_800_000,
    US: 120_000,
    GB: 65_000,
    DE: 70_000,
    CA: 95_000,
    AU: 110_000,
    SG: 90_000,
    JP: 7_000_000,
};

/** Share of the workforce in each country (weights, not percentages; they need not sum to 100). */
export const COUNTRY_WEIGHTS: { value: CountryCode; weight: number }[] = [
     { value: 'IN', weight: 35 },
    { value: 'US', weight: 25 },
    { value: 'GB', weight: 10 },
    { value: 'DE', weight: 10 },
    { value: 'CA', weight: 6 },
    { value: 'AU', weight: 5 },
    { value: 'SG', weight: 5 },
    { value: 'JP', weight: 4 },
];

export interface Role {
    department: Department;
    jobTitle: string;
    multiplier: number; //pay relative to base salary
    weight: number; // how common role is
}

export const ROLES: Role[] = [
    { department: 'Engineering', jobTitle: 'Software Engineer', multiplier: 1.0, weight: 16 },
    {
        department: 'Engineering',
        jobTitle: 'Senior Software Engineer',
        multiplier: 1.4,
        weight: 10,
    },
    { department: 'Engineering', jobTitle: 'Staff Engineer', multiplier: 1.9, weight: 3 },
    { department: 'Engineering', jobTitle: 'Engineering Manager', multiplier: 1.8, weight: 4 },
    { department: 'Product', jobTitle: 'Product Manager', multiplier: 1.3, weight: 5 },
    { department: 'Product', jobTitle: 'Senior Product Manager', multiplier: 1.7, weight: 2 },
    { department: 'Design', jobTitle: 'Product Designer', multiplier: 0.95, weight: 4 },
    { department: 'Design', jobTitle: 'Senior Product Designer', multiplier: 1.3, weight: 2 },
    { department: 'Sales', jobTitle: 'Account Executive', multiplier: 0.9, weight: 10 },
    { department: 'Sales', jobTitle: 'Sales Manager', multiplier: 1.3, weight: 3 },
    { department: 'Marketing', jobTitle: 'Marketing Specialist', multiplier: 0.8, weight: 6 },
    { department: 'Marketing', jobTitle: 'Marketing Manager', multiplier: 1.2, weight: 2 },
    { department: 'Finance', jobTitle: 'Financial Analyst', multiplier: 0.9, weight: 5 },
    { department: 'Finance', jobTitle: 'Finance Manager', multiplier: 1.3, weight: 2 },
    { department: 'HR', jobTitle: 'HR Generalist', multiplier: 0.75, weight: 4 },
    { department: 'HR', jobTitle: 'HR Manager', multiplier: 1.15, weight: 2 },
    { department: 'Operations', jobTitle: 'Operations Associate', multiplier: 0.7, weight: 10 },
    { department: 'Operations', jobTitle: 'Operations Manager', multiplier: 1.1, weight: 3 },
];

export const SALARY_VARIATION = 0.15;

export const HIRE_DATE_RANGE = { from: '2015-01-01', to: '2026-10-31' };