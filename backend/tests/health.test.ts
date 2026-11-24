import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app';
import { EmployeeService } from '../src/employees/employee.service';
import { InMemoryEmployeeRepository } from './fakes/InMemoryEmployeeRepository';

const app = createApp({
  employeeService: new EmployeeService(new InMemoryEmployeeRepository()),
});

describe('health endpoint', () => {
  it('returns 200 and status ok on health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
    });
  });
});
