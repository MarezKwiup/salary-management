import type { Db } from '../db/client';
import { employees } from '../db/schema';
import type { Employee, EmployeeChanges, EmployeeRepository, NewEmployee } from './employee.types';
import { eq, sql } from "drizzle-orm";

export class PgEmployeeRepository implements EmployeeRepository {
    constructor(private readonly db: Db) {}

    async create(data: NewEmployee): Promise<Employee> {
        const [row] = await this.db.insert(employees).values(data).returning();
        if (!row) throw new Error('Insert returned no row');
        return row;
    }

    async findById(id: number): Promise<Employee | null> {
        const [row] = await this.db.select().from(employees).where(eq(employees.id, id));
        return row ?? null;
    }

    async update(id: number, changes: EmployeeChanges): Promise<Employee | null> {
        const [row] = await this.db
            .update(employees)
            .set({ ...changes, updatedAt: sql`now()`})
            .where(eq(employees.id, id))
            .returning();
        return row ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const rows = await this.db
            .delete(employees)
            .where(eq(employees.id, id))
            .returning({ id: employees.id })
        return rows.length > 0;
    }
}
