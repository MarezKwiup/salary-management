import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { InsightsService } from '../../src/insights/insights.service';
import { StubInsightsRepository } from '../fakes/StubInsightsRepository';
import { buildTestApp } from '../helpers/testApp';

let app: Express;
let repo: StubInsightsRepository;

beforeEach(() => {
    repo = new StubInsightsRepository();
    ({ app } = buildTestApp({ insightsService: new InsightsService(repo) }));
});

describe('GET /insights/countries', () => {
    it('200 with the per-country overview', async () => {
        repo.overview = [
            {
                country: 'IN',
                currency: 'INR',
                headcount: 2,
                minSalary: 100,
                maxSalary: 300,
                avgSalary: 200,
                medianSalary: 200
            },
        ];

        const res = await request(app).get('/api/insights/countries');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(repo.overview);
    });
});

describe('GET /insights/countries/:country', () => {
    it('200 with the country detail', async () => {
        const res = await request(app).get('/api/insights/countries/in');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            country: 'IN',
            countryName: 'India',
            currency: 'INR'
        });
        expect(repo.calls).toContain('countrySummary:IN');
    });

    it('400 for an unsupported country', async () => {
        const res = await request(app).get('/api/insights/countries/XX');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('VALIDATION_ERROR');
        expect(repo.calls).toEqual([]);
    });
});
