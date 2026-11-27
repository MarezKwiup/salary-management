import type { CountryCode, Department } from "../lib/countries";

export interface Employee {
    id: number;
    fullName: string;
    jobTitle: string;
    department: Department;
    country: CountryCode;
    currency: string;
    salary: number;
    hireDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Paginated<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export type SortBy = 'fullName' | 'salary' | 'hireDate';
export type SortOrder = 'asc' | 'desc';

export interface EmployeeListQuery {
    search?: string;
    country?: CountryCode;
    department?: Department;
    sortBy: SortBy;
    sortOrder: SortOrder;
    page: number;
    pageSize: number;
}