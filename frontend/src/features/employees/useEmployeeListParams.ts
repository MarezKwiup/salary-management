import { useSearchParams } from "react-router";
import type { EmployeeListQuery } from "../../api/types";
import { parseListParams } from "./employeeListParams";

type Changes = Partial<Omit<EmployeeListQuery, 'pageSize'>>;

/** List state lives in the URL so filtered views can be bookmarked, shared and navigated with Back. */
export function useEmployeeListParams() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = parseListParams(searchParams);

    function update(changes: Changes) {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            for (const [key, value] of Object.entries(changes)) {
                if (value === undefined || value === '') next.delete(key);
                else next.set(key, String(value));
            }

            if(!('page' in changes)) next.delete('page');
            return next;
        })
    }

    return { query, update };
}