import { createApp } from './app.js';
import { env } from './config/env.js';
import { createDb } from './db/client.js';
import { PgEmployeeRepository } from './employees/employee.repository.js';
import { EmployeeService } from './employees/employee.service.js';

let shuttingDown = false;

const { db, pool } = createDb(env.DATABASE_URL);
const employeeService = new EmployeeService(new PgEmployeeRepository(db));
const app = createApp({ employeeService });
const server = app.listen(env.PORT, () => {
    console.log(`Server listening on PORT: ${env.PORT}`);
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
