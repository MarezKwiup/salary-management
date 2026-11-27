import type {
    CountryOverview,
    DepartmentStats,
    InsightsRepository,
    JobTitleStats,
    SalaryStats,
} from '../../src/insights/insights.types';

export class StubInsightsRepository implements InsightsRepository {
    readonly calls: string[] = [];

    overview: CountryOverview[] = [];
    summary: SalaryStats = {
        headcount: 0,
        minSalary: null,
        maxSalary: null,
        avgSalary: null,
        medianSalary: null,
    };
    jobTitleStats: JobTitleStats[] = [];
    departmentStats: DepartmentStats[] = [];

    async countryOverview(): Promise<CountryOverview[]> {
        return this.overview;
    }

    async countrySummary(country: string): Promise<SalaryStats> {
        this.calls.push(`countrySummary:${country}`);
        return this.summary;
    }

    async jobTitles(country: string): Promise<JobTitleStats[]> {
        this.calls.push(`jobTitles:${country}`);
        return this.jobTitleStats;
    }

    async departments(country: string): Promise<DepartmentStats[]> {
        this.calls.push(`departments:${country}`);
        return this.departmentStats;
    }
}
