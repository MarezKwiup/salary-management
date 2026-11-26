import { COUNTRIES, CountryCode } from "../employees/countries";
import { CountryDetail, CountryOverview, InsightsRepository } from "./insights.types";

export class InsightsService {
    constructor(private readonly repo: InsightsRepository) {}

    async countriesOverview(): Promise<CountryOverview[]> {
        return await this.repo.countryOverview();
    }

    async getCountryDetail(country: CountryCode): Promise<CountryDetail> {
        const { name: countryName, currency } = COUNTRIES[country];
        const [summary, jobTitles, departments] = await Promise.all([
            this.repo.countrySummary(country),
            this.repo.jobTitles(country),
            this.repo.departments(country)
        ]);
        return { country, countryName, currency, summary, jobTitles, departments };
    }
}