import express, { Router } from 'express';
import path from 'node:path';

// Serves built react app on same origin as the api

export function serveFrontend(staticDir: string): Router {
    const router = Router();

    router.use(
        '/assets',
        express.static(path.join(staticDir, 'assets'), { immutable: true, maxAge: '1y' }),
    );
    router.use('/assets', (_req, res) => {
        res.status(404).end();
    });
    router.use(express.static(staticDir, { index: false }));

    router.use((req, res, next) => {
        const isApi = req.path === '/api' || req.path.startsWith('/api/');
        if (req.method !== 'GET' || isApi) return next();
        res.sendFile(path.join(staticDir, 'index.html'));
    });

    return router;
}
