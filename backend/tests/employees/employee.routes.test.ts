import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { EmployeeService } from '../../src/employees/employee.service';
import { buildTestApp } from '../helpers/testApp';

let app: Express;
let employeeService: EmployeeService;

beforeEach(() => {
    ({ app, employeeService } = buildTestApp());
});

const validBody = {
    fullName: 'Priya Sharma',
    jobTitle: 'Backend Engineer',
    department: 'Engineering',
    country: 'in',
    salary: 1800000,
    hireDate: '2024-03-15',
};

describe('POST /employees', () => {
    it('201 with the created employee', async () => {
        const res = await request(app).post('/employees').send(validBody);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: 1, country: 'IN', currency: 'INR' });
    });

    it('400 with salary issue for negative salary', async () => {
        const res = await request(app)
            .post('/employees')
            .send({ ...validBody, salary: -5 });
        expect(res.status).toBe(400);
        expect(res.body.issues).toEqual(
            expect.arrayContaining([expect.objectContaining({ path: 'salary' })]),
        );
    });

    it('400 with INVALID_JSON for malformed JSON', async () => {
        const res = await request(app)
            .post('/employees')
            .set('Content-Type', 'application/json')
            .send('{bad');
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('INVALID_JSON');
    });

    it('404 on invalid routes', async () => {
        const res = await request(app).get('/nope');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('NOT_FOUND');
    });

    it('413 on larger than specified payloads', async () => {
        const res = await request(app).post('/employees')
            .send({ ...validBody, fullName: 'a'.repeat(110_000)});
        expect(res.status).toBe(413);
        expect(res.body.error).toBe('PAYLOAD_TOO_LARGE');
    })
});

async function createViaApi() {
    const res = await request(app).post('/employees').send(validBody);
    return res.body as { id: number };
}

describe('DELETE /employees/:id', () => {
    it('204 with no body', async () => {
        const { id } = await createViaApi();
        const res = await request(app).delete(`/employees/${id}`);

        expect(res.status).toBe(204);
        expect(res.text).toBe('');
    })

    it('404 for missing id', async () => {
        const res = await request(app).delete(`/employees`);

        expect(res.status).toBe(404);
        expect(JSON.parse(res.text).error).toBe('NOT_FOUND');
    })
});

describe('PATCH /employees/:id', () => {
    it('200 with valid update body', async () => {
        const { id } = await createViaApi();
        const update = { country: 'DE' };
        const res = await request(app).patch(`/employees/${id}`).send(update);

        expect(res.status).toBe(200);
        expect(res.body.country).toBe('DE');
        expect(res.body.currency).toBe('EUR');
    });

    it('404 for missing id', async () => {
        const res = await request(app).patch(`/employees`).send({ country: 'DE' });

        expect(res.status).toBe(404);
        expect(JSON.parse(res.text).error).toBe('NOT_FOUND');
    });
});

describe('GET /employees/:id', () => {
    it('200 with employee with valid id', async () => {
        const { id } = await createViaApi();
        const res = await request(app).get(`/employees/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.fullName).toBe(validBody.fullName);
        expect(res.body.department).toBe(validBody.department);
        expect(res.body.salary).toBe(validBody.salary);
        expect(res.body.jobTitle).toBe(validBody.jobTitle);
    });

    it('404 for an id that does not exist while other employees do', async () => {
        await createViaApi();
        const res = await request(app).get('/employees/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('NOT_FOUND');
    });
});

describe('GET /employees', () => {
    beforeEach(async () => {
        const base = {
            jobTitle: 'Backend Engineer',
            department: 'Engineering' as const,
            salary: 1_000_000,
            hireDate: '2024-01-01',
        };
        await employeeService.create({ ...base, fullName: 'Priya Sharma', country: 'IN' });
        await employeeService.create({ ...base, fullName: 'Hans Muller', country: 'DE' });
        await employeeService.create({ ...base, fullName: 'Rahul Verma', country: 'IN' });
    });

    it('200 with a paginated response and defaults applied', async () => {
        const res = await request(app).get('/employees');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ page: 1, pageSize: 20, total: 3, totalPages: 1 });
        expect(res.body.data).toHaveLength(3);
    });

    it('applies filters and paging from the query string', async () => {
        const res = await request(app).get('/employees').query({ country: 'in', pageSize: 1});
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ page: 1, pageSize: 1, total: 2, totalPages: 2 });
        expect(res.body.data.map((e: { fullName: string }) => e.fullName)).toEqual([
            'Priya Sharma',
        ]);
    });

    it('400 for pageSize above the maximum', async () => {
        const res = await request(app).get('/employees').query({ pageSize: 1000 });
        expect(res.status).toBe(400);
        expect(res.body.issues).toEqual(
            expect.arrayContaining([expect.objectContaining({ path: 'pageSize' })]),
        );
    });

    it('400 when a filter is repeated', async () => {
        const res = await request(app).get('/employees?country=IN&country=DE');
        expect(res.status).toBe(400);
    });
});
