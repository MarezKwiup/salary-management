# Salary Management — Requirements

## 1. Goal
Replace ACME's spreadsheet-based salary management with a web application that lets an HR Manager maintain salary records for ~10,000 employees across multiple countries, and answer questions about how the organisation pays people, without manual Excel work.

## 2. User & the questions they need answered
**Persona:** HR Manager (single role, full access).

Key questions the tool must answer quickly:
- What is the minimum, maximum, average and median salary in a given country?
- What do we pay a given job title in a given country (e.g. "Software Engineer in India")?
- How many people do we employ per country and per department?
- Where is a specific employee, and what are they paid? (find & update a single record fast)

## 3. Scope — features
**Employee management**
- Add, view, edit and delete an employee.
- Paginated employee list (server-side) with search by name and filters by country, department and job title.
- Input validation with clear error messages (required fields, salary must be a positive integer, country must be a supported country).

**Salary insights**
- Country summary: headcount, min / max / average / median salary.
- Job title within a country: headcount and average salary.
- Department breakdown within a country: headcount and total salary spend.

**Data**
- Seed script generating 10,000 realistic employees, deterministic (fixed random seed) so every run produces identical data.

## 4. Data model
`employees`: `id`, `full_name`, `job_title`, `department`, `country`, `currency`, `salary` (annual, integer, in the local currency), `hire_date`, `created_at`, `updated_at`.
Indexes on `country` and `(country, job_title)` to support filtering and insights.

## 5. Key design decisions
- **Currency is derived from country and never mixed.** Every insight is scoped to a single country and reported in that country's currency. Averaging INR with USD would produce a meaningless number.
- **Salary stored as an integer**, never a floating-point value, to avoid rounding errors.
- **Server-side pagination, filtering and aggregation.** The browser never loads all 10,000 rows. The database does the aggregation work.
- **PostgresSQL** as the database: it is production-grade, supports aggregate functions like percentile_cont for medians directly in SQL, and handles concurrent access if more HR users are added later. Business logic is unit-tested against an in-memory fake repository for speed; SQL queries are integration-tested against a real Postgres instance in Docker.

## 6. Deliberately out of scope (and why)
| Left out | Reason |
|---|---|
| Authentication & roles | Single persona for this exercise. First addition for production. |
| Payroll processing, tax, payslips | A different product. This tool records and analyses salaries; it does not pay them. |
| Currency conversion / org-wide totals | Needs a trusted, dated FX source; wrong conversions are worse than none. |
| Salary change history / audit log | Valuable (raises, pay equity over time) but not needed to answer today's questions. Strong v2 candidate. |
| Excel / CSV import & export | HR's data lives in Excel today, so this is the most likely next feature; left out to keep focus on the core workflow. |
| Bonuses, equity, allowances | Base annual salary only, to keep the model simple and comparable. |

## 7. Assumptions
- Salaries are annual base pay.
- Each country uses exactly one currency.
- One HR Manager uses the tool at a time; no concurrent editing conflicts.

## 8. Success criteria
- All CRUD and insight features work end-to-end in the deployed app.
- Employee list and insight queries respond in well under a second on 10,000 rows.
- Core business logic (validation, insights) is covered by fast, deterministic unit tests.