import { z } from 'zod';
import { COUNTRY_CODES } from './countries';

export const DEPARTMENTS = [
    'Engineering',
    'Product',
    'Design',
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'Operations',
] as const;

export const createEmployeeSchema = z.object({
    fullName: z.string().trim().min(1).max(200),
    jobTitle: z.string().trim().min(1).max(100),
    department: z.enum(DEPARTMENTS),
    country: z.string().trim().toUpperCase().pipe(z.enum(COUNTRY_CODES)),
    salary: z.number().int().positive(),
    hireDate: z.iso.date(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema
    .partial()
    .refine((d) => Object.keys(d).length > 0, { message: 'At least one field is required' });

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export const employeeIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});
