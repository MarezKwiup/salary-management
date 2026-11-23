## 1. Requirements & stack planning
**Tool:** Claude
**Asked:** Plan the tech stack and draft a one-page requirements doc for an HR salary management tool (10k employees, multiple countries).
**Accepted:**
- Stack: TypeScript, Express, React + Vite, Vitest.
- Scoping every salary insight to a single country, reported in local currency, so currencies are never mixed.
- Salary stored as an integer; pagination and aggregation done on the server.
- Out-of-scope list with reasons (auth, payroll, FX conversion, salary history, Excel import).
**Changed/Rejected:**
- Kept the draft as a working version; plan to rewrite it in my own words once the build is done.
- Switched from the suggested SQLite to PostgreSQL: it matches the target role's stack, computes medians natively, and is closer to production. Split tests into unit (fake repository) and integration (Dockerised Postgres) to keep the unit tests fast.
**Why:** Mixing currencies would produce meaningless averages; Postgres plus a two-layer test strategy keeps tests fast without giving up confidence in the real SQL.

## 2. Database schema design
**Tool:** Claude
**Asked:** Design the employees table, explained in raw Postgres first, then as a Drizzle schema.
**Accepted:** Identity primary key, integer salary with a CHECK constraint, timestamptz, char(3) currency.
**Changed/Rejected:** Dropped the separate index on country: the composite (country, job_title) index already serves country-only queries (leftmost prefix rule).
**Why:** Fewer indexes means cheaper writes with no loss in read performance. The DB-level CHECK backs up API validation.

## 3. Test database strategy
**Tool:** Claude
**Asked:** Set up a reliable test database for integration tests.
**Accepted:** Separate Dockerised test DB (tmpfs), migrations applied in test setup, TRUNCATE ... RESTART IDENTITY before each test.
**Changed/Rejected:** Disabled Vitest file parallelism instead of creating a database per test file.
**Why:** Parallel files sharing one DB cause flaky tests; a DB per file adds complexity that isn't worth it at this size. Resetting identities keeps ids deterministic.