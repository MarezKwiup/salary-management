import type { employees } from '../db/schema';
import { ListEmployeesParams, UpdateEmployeeInput } from './employee.validation';

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

export interface EmployeeRepository {
    create(data: NewEmployee): Promise<Employee>;
    findById(id: number): Promise<Employee | null>;
    update(id: number, changes: EmployeeChanges): Promise<Employee | null>;
    delete(id: number): Promise<boolean>;
    list(params: ListEmployeesParams): Promise<{rows: Employee[]; total: number}>;
}

export type EmployeeChanges = UpdateEmployeeInput & { currency?: string };

export interface Paginated<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
