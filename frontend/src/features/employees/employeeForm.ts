import type { Employee, EmployeeInput } from "../../api/types";
import type { CountryCode, Department } from "../../lib/countries";

export interface EmployeeFormValues {
    fullName: string;
    jobTitle: string;
    department: Department | '';
    country: CountryCode | '';
    salary: number | '';
    hireDate: string;
}

export const emptyEmployeeForm: EmployeeFormValues = {
    fullName: '',
    jobTitle: '',
    department: '',
    country: '',
    salary: '',
    hireDate: '',
};

export function toFormValues(employee: Employee): EmployeeFormValues {
    const { fullName, jobTitle, salary, department, country, hireDate } = employee;
    return { fullName, jobTitle, department, country, salary, hireDate };
}

/** Client-side checks for fast feedback. The server validates again and stays the source of truth. */
export const employeeFormValidation = {
    fullName: (value: string) => (value.trim() ? null : 'Name is required'),
    jobTitle: (value: string) => (value.trim() ? null : 'Job title is required' ),
    department: (value: string) => (value ? null : 'Pick a department'),
    country: (value: string) => (value ? null : 'Pick a country'),
    salary: (value: number | '') =>
        typeof value === 'number' && Number.isInteger(value) && value > 0
            ? null
            : 'Enter a whole number above 0',
    hireDate: (value: string) => (value ? null : 'Hire date is required'),
};

export function toEmployeeInput(values: EmployeeFormValues): EmployeeInput {
    return {
        fullName: values.fullName.trim(),
        jobTitle: values.jobTitle.trim(),
        department: values.department as Department,
        country: values.country as CountryCode,
        salary: values.salary as number,
        hireDate: values.hireDate
    };
}