import { currencyFor } from './countries';
import type {
    CreateEmployeeInput,
    ListEmployeesParams,
    ListEmployeesQuery,
    UpdateEmployeeInput,
} from './employee.validation';
import type { EmployeeChanges, EmployeeRepository, Employee, Paginated } from './employee.types';
import { NotFoundError } from '../errors';

export class EmployeeService {
    constructor(private readonly repo: EmployeeRepository) {}

    async create(input: CreateEmployeeInput): Promise<Employee> {
        return this.repo.create({ ...input, currency: currencyFor(input.country) });
    }

    async getById(id: number): Promise<Employee> {
        const employee = await this.repo.findById(id);
        if (!employee) throw new NotFoundError(`Employee ${id} not found`);
        return employee;
    }

    async update(id: number, input: UpdateEmployeeInput): Promise<Employee> {
        const changes: EmployeeChanges = input.country
            ? { ...input, currency: currencyFor(input.country) }
            : input;
        const employee = await this.repo.update(id, changes);
        if (!employee) throw new NotFoundError(`Employee ${id} not found`);
        return employee;
    }

    async delete(id: number): Promise<void> {
        const deleted = await this.repo.delete(id);
        if (!deleted) throw new NotFoundError(`Employee ${id} not found`);
    }

    async list(query: ListEmployeesQuery): Promise<Paginated<Employee>> {
        const { page, pageSize, ...filters } = query;
        const params: ListEmployeesParams = {
            ...filters,
            limit: pageSize,
            offset: (page - 1) * pageSize,
        };
        const { rows, total } = await this.repo.list(params);
        return {
            data: rows,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }
}
