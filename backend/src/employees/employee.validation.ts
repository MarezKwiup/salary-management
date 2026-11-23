import { z } from "zod";
import { COUNTRY_CODES } from "./countries";

export const createEmployeeSchema = z.object({
    fullName: z.string().trim().min(1),
    jobTitle: z.string().trim().min(1),
    department: z.string().trim().min(1),
    country: z.string().trim().toUpperCase().pipe(z.enum(COUNTRY_CODES)),
    salary: z.number().int().positive(),
    hireDate: z.iso.date(), 
});