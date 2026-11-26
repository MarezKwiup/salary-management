import { CountryCode } from "../employees/countries";

export interface SalaryStats {
    headcount: number;
    minSalary: number | null;
    maxSalary: number | null;
    avgSalary: number | null;
    medianSalary: number | null;
}

export interface CountryOverview extends SalaryStats {
    country: string;
    currency: string;
}

export interface JobTitleStats extends SalaryStats {
    jobTitle: string;
}

export interface DepartmentStats {
    department: string;
    totalSalary: number;
    headcount: number;
    avgSalary: number | null;
}

export interface InsightsRepository {
    countryOverview(): Promise<CountryOverview[]>;
    countrySummary(country: string): Promise<SalaryStats>;
    jobTitles(country: string): Promise<JobTitleStats[]>;
    departments(country: string): Promise<DepartmentStats[]>;
}

export interface CountryDetail {
    country: CountryCode;
    countryName: string;
    currency: string;
    summary: SalaryStats;
    jobTitles: JobTitleStats[];
    departments: DepartmentStats[];
}