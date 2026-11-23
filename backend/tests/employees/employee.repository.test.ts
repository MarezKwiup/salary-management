import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { setupTestDb, resetDb } from "../helpers/testDb";
import { PgEmployeeRepository } from "../../src/employees/employee.repository";
import type { Db } from "../../src/db/client";
import type { NewEmployee } from "../../src/employees/employee.types";

let db: Db;
let close: () => Promise<void>;
let repo: PgEmployeeRepository;

const newEmployee: NewEmployee = {
  fullName: "Priya Sharma",
  jobTitle: "Backend Engineer",
  department: "Engineering",
  country: "IN",
  currency: "INR",       
  salary: 1800000,
  hireDate: "2024-01-01",
};

beforeAll(async () => {
  ({ db, close } = await setupTestDb());
  repo = new PgEmployeeRepository(db);
});

beforeEach(async () => {
    await resetDb(db);
});

afterAll(async () => {
    await close?.();
});

describe("PgEmployeeRepository.create", () => {
    it("persists an employee and returns stored row", async () => {
        const emp = await repo.create(newEmployee);

        expect(emp.id).toBe(1);
        expect(emp.createdAt).toBeInstanceOf(Date);
        expect(emp.hireDate).toBe("2024-01-01");
        expect(emp).toMatchObject(newEmployee);
    });

    it("database rejects salary of 0", async () => {
        await expect(repo.create({ ...newEmployee, salary: 0 })).rejects.toMatchObject({
            cause: { code: "23514", constraint: "employees_salary_positive" },
        });
    });
});