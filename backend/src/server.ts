import { existsSync } from 'node:fs';
import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { createDb } from './db/client.js';
import { PgEmployeeRepository } from './employees/employee.repository.js';
import { EmployeeService } from './employees/employee.service.js';
import { PgInsightsRepository } from './insights/insights.repository.js';
import { InsightsService } from './insights/insights.service.js';

const MIGRATIONS_DIR = path.resolve(__dirname, '../drizzle');
const FRONTEND_DIR = path.resolve(__dirname, '../../frontend/dist');

let shuttingDown = false;

const { db, pool } = createDb(env.DATABASE_URL);
const employeeService = new EmployeeService(new PgEmployeeRepository(db));
const insightsService = new InsightsService(new PgInsightsRepository(db));

// Serve the built frontend only if it exists (production); in development Vite serves it
const staticDir = existsSync(path.join(FRONTEND_DIR, 'index.html')) ? FRONTEND_DIR : undefined;
const app = createApp({ employeeService, insightsService, staticDir });

async function main() {
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

    const server = app.listen(env.PORT, () => {
        console.log(`Server listening on PORT: ${env.PORT}`);
        if (staticDir) console.log(`Serving frontend from ${staticDir}`);
    });

    function shutdown(signal: string) {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`${signal} received, shutting down`);

        server.close(async (closeErr) => {
            if (closeErr) console.error('Error closing HTTP server', closeErr);
            try {
                await pool.end();
                process.exit(closeErr ? 1 : 0);
            } catch (poolErr) {
                console.error('Error closing database pool', poolErr);
                process.exit(1);
            }
        });
        server.closeIdleConnections();

        setTimeout(() => {
            console.error('Shutdown timed out, forcing exit');
            process.exit(1);
        }, 10_000).unref();
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch(async (error) => {
    console.error('Failed to start server', error);
    await pool.end();
    process.exit(1);
});
