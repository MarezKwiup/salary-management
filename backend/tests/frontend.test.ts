import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';
import { buildTestApp } from './helpers/testApp';

// A tiny stand-in for frontend/dist, so the test does not depend on a real build
let staticDir: string;
let app: Express;

beforeAll(() => {
    staticDir = mkdtempSync(path.join(tmpdir(), 'frontend-dist-'));
    mkdirSync(path.join(staticDir, 'assets'));
    writeFileSync(path.join(staticDir, 'index.html'), '<!doctype html><div id="root"></div>');
    writeFileSync(path.join(staticDir, 'assets', 'index-abc123.js'), 'console.log("app")');
    ({ app } = buildTestApp({ staticDir }));
});

afterAll(() => {
    rmSync(staticDir, { recursive: true, force: true });
});

describe('serving the built frontend', () => {
    it.each(['/', '/employees', '/insights/IN'])('returns index.html for %s', async (url) => {
        const res = await request(app).get(url);

        expect(res.status).toBe(200);
        expect(res.text).toContain('<div id="root">');
    });

    it('serves hashed assets with a long-lived cache header', async () => {
        const res = await request(app).get('/assets/index-abc123.js');

        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toContain('immutable');
    });

    it('returns 404 for a missing asset instead of index.html', async () => {
        const res = await request(app).get('/assets/missing.js');

        expect(res.status).toBe(404);
        expect(res.text).not.toContain('<div id="root">');
    });

    it('still returns JSON 404 for unknown API routes', async () => {
        const res = await request(app).get('/api/nope');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('NOT_FOUND');
    });

    it('keeps the API working alongside the frontend', async () => {
        const res = await request(app).get('/api/employees');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ page: 1, total: 0 });
    });
});

describe('without a built frontend', () => {
    it('does not serve index.html', async () => {
        const { app: apiOnly } = buildTestApp();

        const res = await request(apiOnly).get('/employees');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('NOT_FOUND');
    });
});