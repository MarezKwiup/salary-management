import { beforeEach, describe, expect, it } from "vitest";
import { InsightsService } from '../../src/insights/insights.service';
import { StubInsightsRepository } from '../fakes/StubInsightsRepository';

let repo: StubInsightsRepository;
let service: InsightsService;

beforeEach(() => {
    repo = new StubInsightsRepository();
    service = new InsightsService(repo);
});

describe('InsightsService.getCountryDetail', () => {
    it('combines summary, job titles and departments for the country', async () => {
        repo.summary = {
            headcount: 2,
            minSalary: 100,
            maxSalary: 300,
            avgSalary: 200,
            medianSalary: 200,
        };
        repo.jobTitleStats = [
            {
                jobTitle: 'Backend Engineer',
                headcount: 2,
                minSalary: 100,
                maxSalary: 300,
                avgSalary: 200,
                medianSalary: 200
            }
        ];
        repo.departmentStats = [
            { department: 'Engineering', headcount: 2, totalSalary: 400, avgSalary: 200 },
        ];

        const detail = await service.getCountryDetail('IN');

        expect(detail).toEqual({
            country: 'IN',
            countryName: 'India',
            currency: 'INR',
            summary: repo.summary,
            jobTitles: repo.jobTitleStats,
            departments: repo.departmentStats,
        });
    });

    it('takes country name and currency from the country list, even with no employees', async () => {
        const detail = await service.getCountryDetail('JP');

        expect(detail).toMatchObject({
            country: 'JP',
            countryName: 'Japan',
            currency: 'JPY',
            summary: { headcount: 0 },
            jobTitles: [],
            departments: [],
        });
    });

    it('asks the repository about the requested country only', async () => {
        await service.getCountryDetail('DE');

        expect(repo.calls.sort()).toEqual(['countrySummary:DE', 'departments:DE', 'jobTitles:DE']);
    });
});

describe('InsightsService.countryOverview', () => {
    it('returns the overview from the repository', async () => {
        repo.overview = [
            {
                country: 'IN',
                currency: 'INR',
                headcount: 1,
                minSalary: 100,
                maxSalary: 100,
                avgSalary: 100,
                medianSalary: 100
            },
        ];

        expect(await service.countriesOverview()).toEqual(repo.overview);
    });
});