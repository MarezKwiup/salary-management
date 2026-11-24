import type { Employee, EmployeeRepository, NewEmployee } from '../../src/employees/employee.types';

export class InMemoryEmployeeRepository implements EmployeeRepository {
    private rows: Employee[] = [];
    private nextId = 1;

    async create(data: NewEmployee): Promise<Employee> {
        const now = new Date();
        const created = { ...data, id: this.nextId++, createdAt: now, updatedAt: now };
        this.rows.push(created);
        return created;
    }
}
