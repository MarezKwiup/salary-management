import { count, desc, eq, max, min, sql } from 'drizzle-orm';
import type { Db } from '../db/client';
import { employees } from '../db/schema';
import { CountryOverview, InsightsRepository } from './insights.types';

const salaryStats = {
    headcount: count(),
    minSalary: min(employees.salary),
    maxSalary: max(employees.salary),
    avgSalary: sql<number | null>`round(avg(${employees.salary}))`.mapWith(Number),
    medianSalary: sql<number | null>`round(percentile_cont(0.5) within group (order by ${employees.salary}))`.mapWith(Number),
};

export class PgInsightsRepository implements InsightsRepository {
    constructor(private readonly db: Db) {}

    countryOverview() {
        return this.db
            .select({ country: employees.country, currency: employees.currency, ...salaryStats })
            .from(employees)
            .groupBy(employees.country, employees.currency)
            .orderBy(employees.country);
    }

    async countrySummary(country: string) {
        const [row] = await this.db.select(salaryStats).from(employees).where(eq(employees.country, country));
        return row!;
    }

    jobTitles(country: string) {
        return this.db
            .select({ jobTitle: employees.jobTitle, ...salaryStats })
            .from(employees)
            .where(eq(employees.country, country))
            .groupBy(employees.jobTitle)
            .orderBy(desc(sql`avg(${employees.salary})`), employees.jobTitle);
    }

    departments(country: string) {
        return this.db
            .select({
                department: employees.department,
                headcount: count(),
                totalSalary: sql<number>`sum(${employees.salary})`.mapWith(Number),
                avgSalary: salaryStats.avgSalary,
            })
            .from(employees)
            .where(eq(employees.country, country))
            .groupBy(employees.department)
            .orderBy(desc(sql`sum(${employees.salary})`));
    }
}