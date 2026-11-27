import type { EmployeeListQuery, SortBy, SortOrder } from "../../api/types";
import { DEPARTMENTS, isCountryCode, type Department } from "../../lib/countries";

const SORT_BY: SortBy[] = ['fullName', 'salary', 'hireDate'];
export const PAGE_SIZE = 20;

export function parseListParams(params: URLSearchParams): EmployeeListQuery {
    const country = params.get('country') ?? '';
    const department = params.get('department') ?? '';
    const sortBy = params.get('sortBy') as SortBy;
    const page = Number(params.get('page'));

    return {
        search: params.get('search') || undefined,
        country: isCountryCode(country) ? country : undefined,
        department: DEPARTMENTS.includes(department as Department)
            ? (department as Department)
            : undefined,
        sortBy: SORT_BY.includes(sortBy) ? sortBy : 'fullName',
        sortOrder: (params.get('sortOrder') === 'desc' ? 'desc' : 'asc') as SortOrder,
        page: Number.isInteger(page) && page > 0 ? page : 1,
        pageSize: PAGE_SIZE,
    };
}