import { setupTestDb, resetDb } from "./helpers/testDb.js";
import type { Db } from "../src/db/client.js";
import { afterAll, beforeAll, expect } from "vitest";
import { beforeEach } from "node:test";
import { test } from "vitest";
import { sql } from "drizzle-orm";

let db: Db;
let close: () => Promise<void>;

beforeAll(async () => {
    const t = await setupTestDb();
    db = t.db;
    close = t.close;
});

beforeEach( async () => {
    await resetDb(db);
});

afterAll(async () => {
    await close?.();
});

test("employees table exists and starts empty", async () => {
    const res = await db.execute(sql`SELECT count(*)::int AS count from employees`);
    expect(res.rows[0].count).toEqual(0);
})