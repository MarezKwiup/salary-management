import type { Db } from '../db/client';
import { employees } from '../db/schema';
import type { Employee, EmployeeRepository, NewEmployee } from './employee.types';

export class PgEmployeeRepository implements EmployeeRepository {
  constructor(private readonly db: Db) {}

  async create(data: NewEmployee): Promise<Employee> {
    const [row] = await this.db.insert(employees).values(data).returning();
    if (!row) throw new Error('Insert returned no row');
    return row;
  }
}
