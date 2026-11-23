import { currencyFor } from "./countries";
import type { CreateEmployeeInput } from "./employee.validation";
import type { EmployeeRepository } from "./employee.types";

export class EmployeeService {
    constructor(private readonly repo: EmployeeRepository) {}

    async create(input: CreateEmployeeInput) {
        return this.repo.create({ ...input, currency: currencyFor(input.country) });
    }
}