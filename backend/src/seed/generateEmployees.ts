import { Faker, base, de, en, en_AU, en_CA, en_GB, en_IN, en_US } from '@faker-js/faker';
import { currencyFor, type CountryCode } from '../employees/countries';
import type { NewEmployee } from '../employees/employee.types';
import { BASE_SALARY, COUNTRY_WEIGHTS, HIRE_DATE_RANGE, ROLES, SALARY_VARIATION } from './seedData';

const NAME_LOCALES = {
    IN: [en_IN, en, base],
    US: [en_US, en, base],
    GB: [en_GB, en, base],
    DE: [de, en, base],
    CA: [en_CA, en, base],
    AU: [en_AU, en, base],
    SG: [en, base],
    JP: [en, base],
} satisfies Record<CountryCode, unknown>;

const ROLE_CHOICES = ROLES.map((role) => ({ value: role, weight: role.weight }));

export function generateEmployees(count: number, seed = 42): NewEmployee[] {
    const random = new Faker({ locale: [en, base] });
    random.seed(seed);

    const namesByCountry = Object.fromEntries(
        Object.entries(NAME_LOCALES).map(([country, locale], index) => {
            const faker = new Faker({ locale });
            faker.seed(seed + index + 1);
            return [country, faker];
        }),
    ) as Record<CountryCode, Faker>;

    return Array.from({ length: count }, () => {
        const country = random.helpers.weightedArrayElement(COUNTRY_WEIGHTS);
        const role = random.helpers.weightedArrayElement(ROLE_CHOICES);
        const variation = random.number.float({
            min: 1 - SALARY_VARIATION,
            max: 1 + SALARY_VARIATION,
        });
        const salary =
            Math.round((BASE_SALARY[country] * role.multiplier * variation) / 1000) * 1000;
        const hireDate = random.date.between(HIRE_DATE_RANGE).toISOString().slice(0, 10);

        const names = namesByCountry[country];
        return {
            fullName: `${names.person.firstName()} ${names.person.lastName()}`,
            jobTitle: role.jobTitle,
            department: role.department,
            country,
            currency: currencyFor(country),
            salary,
            hireDate,
        };
    });
}
