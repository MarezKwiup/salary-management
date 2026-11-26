import { sql } from 'drizzle-orm';
import { env } from '../config/env';
import { createDb } from '../db/client';
import { employees } from '../db/schema';
import { generateEmployees } from './generateEmployees';

const EMPLOYEE_COUNT = 10_000;

// Postgres allows at most 65,535 bind parameters per statement.
// 7 columns × 1,000 rows = 7,000 parameters per INSERT, comfortably under the limit.
const CHUNK_SIZE = 1_000;

async function main() {
    const { db, pool } = createDb(env.DATABASE_URL);
    const started = performance.now();

    try {
        const rows = generateEmployees(EMPLOYEE_COUNT);

        await db.transaction(async (tx) => {
            await tx.execute(sql`TRUNCATE TABLE employees RESTART IDENTITY`);
            for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
                await tx.insert(employees).values(rows.slice(i, i + CHUNK_SIZE));
            }
        });

        const seconds = ((performance.now() - started) / 1000).toFixed(2);
        console.log(`Seeded ${rows.length} employees in ${seconds}s`);
    } finally {
        await pool.end();
    }
}

main().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});