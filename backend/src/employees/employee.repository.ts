import type { Db } from '../db/client';
import { employees } from '../db/schema';
import type { Employee, EmployeeChanges, EmployeeRepository, NewEmployee } from './employee.types';
import { eq, sql, and, asc, count, desc, ilike, type SQL } from 'drizzle-orm';
import { escapeLike } from '../db/escapeLike';
import { ListEmployeesParams } from './employee.validation';

const sortColumns = {
    fullName: employees.fullName,
    salary: employees.salary,
    hireDate: employees.hireDate,
} as const;

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
            .set({ ...changes, updatedAt: sql`now()` })
            .where(eq(employees.id, id))
            .returning();
        return row ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const rows = await this.db
            .delete(employees)
            .where(eq(employees.id, id))
            .returning({ id: employees.id });
        return rows.length > 0;
    }

    async list(params: ListEmployeesParams): Promise<{ rows: Employee[]; total: number }> {
        const conditions: SQL[] = [];
        if (params.search)
            conditions.push(ilike(employees.fullName, `%${escapeLike(params.search)}%`));
        if (params.country) conditions.push(eq(employees.country, params.country));
        if (params.department) conditions.push(eq(employees.department, params.department));
        if (params.jobTitle) conditions.push(eq(employees.jobTitle, params.jobTitle));

        const where = and(...conditions);

        const direction = params.sortOrder === 'desc' ? desc : asc;

        const [rows, totals] = await Promise.all([
            this.db
                .select()
                .from(employees)
                .where(where)
                .orderBy(direction(sortColumns[params.sortBy]), asc(employees.id))
                .limit(params.limit)
                .offset(params.offset),
            this.db.select({ total: count() }).from(employees).where(where),
        ]);

        return { rows, total: totals[0]?.total ?? 0 };
    }
}
