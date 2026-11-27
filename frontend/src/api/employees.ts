import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Employee, EmployeeListQuery, Paginated } from "./types";

export function toSearchParams(query: EmployeeListQuery): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== '') params.set(key, String(value));
    }
    return params;
}

export function listEmployees(query: EmployeeListQuery): Promise<Paginated<Employee>> {
    return apiFetch(`/employees?${toSearchParams(query)}`);
}

export const employeeKeys = {
    all: ['employees'] as const,
    list: (query: EmployeeListQuery) => ['employees', 'list', query] as const,
};

export function useEmployees(query: EmployeeListQuery) {
    return useQuery({
        queryKey: employeeKeys.list(query),
        queryFn: () => listEmployees(query),
        placeholderData: keepPreviousData,
    });
}