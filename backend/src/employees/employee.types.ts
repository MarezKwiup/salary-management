import type { employees } from '../db/schema';

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

export interface EmployeeRepository {
  create(data: NewEmployee): Promise<Employee>;
}
