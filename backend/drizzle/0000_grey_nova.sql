CREATE TABLE "employees" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "employees_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"full_name" text NOT NULL,
	"job_title" text NOT NULL,
	"department" text NOT NULL,
	"country" text NOT NULL,
	"currency" char(3) NOT NULL,
	"salary" integer NOT NULL,
	"hire_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_salary_positive" CHECK ("employees"."salary" > 0)
);
--> statement-breakpoint
CREATE INDEX "employees_country_job_title_idx" ON "employees" USING btree ("country","job_title");