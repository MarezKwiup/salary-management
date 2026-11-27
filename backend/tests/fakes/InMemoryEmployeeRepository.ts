import type {
    Employee,
    EmployeeChanges,
    EmployeeRepository,
    NewEmployee,
} from '../../src/employees/employee.types';
import { ListEmployeesParams } from '../../src/employees/employee.validation';

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
        return this.rows.find((row) => row.id === id) ?? null;
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

    async list(params: ListEmployeesParams): Promise<{ rows: Employee[]; total: number }> {
        const search = params.search?.toLowerCase();
        const matches = this.rows.filter(
            (row) =>
                (!search || row.fullName.toLowerCase().includes(search)) &&
                (!params.country || row.country === params.country) &&
                (!params.department || row.department === params.department) &&
                (!params.jobTitle || row.jobTitle === params.jobTitle),
        );

        const direction = params.sortOrder === 'desc' ? -1 : 1;
        const sorted = [...matches].sort((a, b) => {
            const left = a[params.sortBy];
            const right = b[params.sortBy];
            if (left < right) return -1 * direction;
            if (left > right) return 1 * direction;
            return a.id - b.id;
        });

        return {
            rows: sorted.slice(params.offset, params.offset + params.limit),
            total: matches.length,
        };
    }
}
