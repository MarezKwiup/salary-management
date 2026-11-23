import { InMemoryEmployeeRepository } from "../fakes/InMemoryRepository";
import { EmployeeService } from "../../src/employees/employee.service";
import { beforeEach, expect, describe, test } from "vitest";
import type { CreateEmployeeInput } from "../../src/employees/employee.validation";

let service: EmployeeService;

beforeEach(() => {
    service = new EmployeeService(new InMemoryEmployeeRepository());
});

const validInput: CreateEmployeeInput = {
    fullName: " Priya Sharma ",
    jobTitle: "Backend Engineer",
    department: "Engineering",
    country: "IN",
    salary: 1800000,
    hireDate: "2024-03-15",
}

describe("EmployeeService.create", () => {
  test("sets currency from country", async () => {
    const emp = await service.create({ ...validInput, country: "JP" });

    expect(emp.id).toBe(1);
    expect(emp.currency).toBe("JPY");
    expect(emp.createdAt).toBeInstanceOf(Date);
  });
});