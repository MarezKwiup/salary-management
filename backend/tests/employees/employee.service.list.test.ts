import { EmployeeService } from '../../src/employees/employee.service';
import { listEmployeesQuerySchema } from '../../src/employees/employee.validation';
import { beforeEach, it, describe, expect } from 'vitest';
import { InMemoryEmployeeRepository } from '../fakes/InMemoryEmployeeRepository';

let service: EmployeeService;

const query = (input: Record<string, unknown> = {}) => listEmployeesQuerySchema.parse(input);

beforeEach(async () => {
    service = new EmployeeService(new InMemoryEmployeeRepository());
    for (let n = 1; n <= 45; n++) {
        await service.create({
            fullName: `Employee ${String(n).padStart(2, '0')}`,
            jobTitle: 'Backend Engineer',
            department: 'Engineering',
            country: 'IN',
            salary: 1_000_000,
            hireDate: '2024-01-01',
        });
    }
});

describe('EmployeeService.list', () => {
    it('computes totalPages from total and page size', async () => {
        const result = await service.list(query({ pageSize: 20 }));
        expect(result).toMatchObject({ page: 1, pageSize: 20, total: 45, totalPages: 3 });
        expect(result.data).toHaveLength(20);
    });

    it('turns page and pageSize into the right offset', async () => {
        const result = await service.list(query({ page: 3, pageSize: 20 }));
        expect(result.data.map((e) => e.fullName)).toEqual([
            'Employee 41',
            'Employee 42',
            'Employee 43',
            'Employee 44',
            'Employee 45',
        ]);
    });

    it('returns zero pages when nothing matches', async () => {
        const result = await service.list(query({ search: 'nobody' }));
        expect(result).toEqual({ data: [], page: 1, pageSize: 20, total: 0, totalPages: 0 });
    });
});
