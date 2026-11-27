import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Employee, EmployeeInput, EmployeeListQuery, Paginated } from "./types";

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

export function createEmployee(input: EmployeeInput): Promise<Employee> {
    return apiFetch('/employees', { method: 'POST', body: JSON.stringify(input) });
}

export function updateEmployee(id: number, input: Partial<EmployeeInput>): Promise<Employee> {
    return apiFetch(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function deleteEmployee(id: number): Promise<void> {
    return apiFetch(`/employees/${id}`, { method: 'DELETE' });
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

function useInvalidateEmployeeData() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
            queryClient.invalidateQueries({ queryKey: ['insights'] }),
        ]);
}

export function useCreateEmployee() {
    const invalidate = useInvalidateEmployeeData();
    return useMutation({ mutationFn: createEmployee, onSuccess: invalidate });
}

export function useUpdateEmployee() {
    const invalidate = useInvalidateEmployeeData();
    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: Partial<EmployeeInput> }) =>
            updateEmployee(id, input),
        onSuccess: invalidate,
    });
}

export function useDeleteEmployee() {
    const invalidate = useInvalidateEmployeeData();
    return useMutation({ mutationFn: deleteEmployee, onSuccess: invalidate });
}