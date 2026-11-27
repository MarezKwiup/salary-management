import { z } from 'zod';
import { COUNTRY_CODES } from '../employees/countries';

export const countryParamSchema = z.object({
    country: z.string().trim().toUpperCase().pipe(z.enum(COUNTRY_CODES)),
});

export type CountryParam = z.infer<typeof countryParamSchema>;
