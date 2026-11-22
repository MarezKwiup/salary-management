import { sql } from "drizzle-orm";
import { check, char, date, index, integer, pgTable,text, timestamp } from "drizzle-orm/pg-core";

export const employees = pgTable(
    "employees",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        fullName: text("full_name").notNull(),
        jobTitle: text("job_title").notNull(),
        department: text("department").notNull(),
        country: text("country").notNull(),
        currency: char("currency", { length: 3 }).notNull(),
        salary: integer("salary").notNull(),
        hireDate: date("hire_date").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [
        index("employees_country_job_title_idx").on(t.country, t.jobTitle),
        check("employees_salary_positive", sql`${t.salary} > 0`),
    ],
);