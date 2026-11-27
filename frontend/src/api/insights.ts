import { useQuery } from "@tanstack/react-query";
import type { CountryCode } from "../lib/countries";
import { apiFetch } from "./client";

export interface SalaryStats {
    headcount: number;
    minSalary: number | null;
    maxSalary: number | null;
    avgSalary: number | null;
    medianSalary: number | null;
}

export interface CountryOverview extends SalaryStats {
    country: CountryCode;
    currency: string;
}

export interface JobTitleStats extends SalaryStats {
    jobTitle: string;
}

export interface DepartmentStats {
    department: string;
    headcount: string;
    totalSalary: number;
    avgSalary: number | null;
}

export interface CountryDetail {
    country: CountryCode;
    countryName: string;
    currency: string;
    summary: SalaryStats;
    jobTitles: JobTitleStats[];
    departments: DepartmentStats[];
}

export const insightsKeys = {
    overview: ['insights', 'countries'] as const,
    country: (country: CountryCode) => ['insights', 'countries', country] as const,
};

export function useCountryOverview() {
    return useQuery({
        queryKey: insightsKeys.overview,
        queryFn: () => apiFetch<CountryOverview[]>('/insights/countries'),
    });
}

export function useCountryDetail(country: CountryCode) {
    return useQuery({
        queryKey: insightsKeys.country(country),
        queryFn: () => apiFetch<CountryDetail>(`/insights/countries/${country}`),
    });
}