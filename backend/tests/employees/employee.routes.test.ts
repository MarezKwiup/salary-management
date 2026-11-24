import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app';
import { EmployeeService } from '../../src/employees/employee.service';
import { InMemoryEmployeeRepository } from '../fakes/InMemoryEmployeeRepository';

let app: Express;

beforeEach(() => {
    const employeeService = new EmployeeService(new InMemoryEmployeeRepository());
    app = createApp({ employeeService });
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
