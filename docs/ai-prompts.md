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