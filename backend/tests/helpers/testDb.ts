import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createDb, type Db } from '../../src/db/client';

export async function setupTestDb() {
    const url = process.env.TEST_DATABASE_URL;
    if (!url) throw new Error('TEST_DATABASE_URL is not set');
    const { db, pool } = createDb(url);
    await migrate(db, { migrationsFolder: './drizzle' });
    return { db, close: () => pool.end() };
}

export async function resetDb(db: Db) {
    await db.execute(sql`TRUNCATE TABLE employees RESTART IDENTITY`);
}
