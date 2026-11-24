import type { Employee, EmployeeChanges, EmployeeRepository, NewEmployee } from '../../src/employees/employee.types';

export class InMemoryEmployeeRepository implements EmployeeRepository {
    private rows: Employee[] = [];
    private nextId = 1;

    async create(data: NewEmployee): Promise<Employee> {
        const now = new Date();
        const created = { ...data, id: this.nextId++, createdAt: now, updatedAt: now };
        this.rows.push(created);
        return created;
    }

    async findById(id: number): Promise<Employee | null> {
        const row = this.rows.findIndex((row) => row.id === id);
        if (row === -1) return null;
        return this.rows[row];
    }

    async update(id: number, changes: EmployeeChanges): Promise<Employee | null> {
        const index = this.rows.findIndex((row) => row.id === id);
        const existing = this.rows[index];
        if (!existing) return null;
        const defined = Object.fromEntries(
            Object.entries(changes).filter(([, value]) => value !== undefined),
        );
        const updated: Employee = { ...existing, ...defined, updatedAt: new Date() };
        this.rows[index] = updated;
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const row = this.rows.findIndex((row) => row.id === id);
        if (row === -1) return false;
        this.rows.splice(row, 1);
        return true;
    }
}
