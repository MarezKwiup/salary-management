import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { buildTestApp } from './helpers/testApp';
const { app } = buildTestApp();

describe('health endpoint', () => {
    it('returns 200 and status ok on health endpoint', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            status: 'ok',
        });
    });
});
