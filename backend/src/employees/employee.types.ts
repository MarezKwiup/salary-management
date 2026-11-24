import type { employees } from '../db/schema';
import { UpdateEmployeeInput } from './employee.validation';

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

export interface EmployeeRepository {
    create(data: NewEmployee): Promise<Employee>;
    findById(id: number): Promise<Employee | null>;
    update(id: number, changes: EmployeeChanges): Promise<Employee | null>;
    delete(id: number): Promise<boolean>;
}

export type EmployeeChanges = UpdateEmployeeInput & { currency?: string };
