import { Button, Group, Select, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import type { EmployeeListQuery } from '../api/types';
import { 
    COUNTRIES,
    COUNTRY_CODES,
    DEPARTMENTS,
    type CountryCode,
    type Department
} from '../lib/countries';

interface Props {
    query: EmployeeListQuery;
    onChange: (changes: Partial<EmployeeListQuery>) => void;
}

const countryOptions = COUNTRY_CODES.map((code) => ({ value: code, label: COUNTRIES[code].name }));

export function EmployeeFilters({ query, onChange }: Props) {
    const [search, setSearch] = useState(query.search ?? '');
    const applySearch = useDebouncedCallback(
        (value: string) => onChange({ search: value.trim() || undefined }),
        300,
    );

    const hasFilters = Boolean(query.search || query.country || query.department);

    return (
        <Group align="end">
            <TextInput
                label="Search"
                placeholder="Employee name"
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(event) => {
                    setSearch(event.currentTarget.value);
                    applySearch(event.currentTarget.value);
                }}
                w={260}
            />
            <Select
                label="Country"
                placeholder="All countries"
                data={countryOptions}
                value={query.country ?? null}
                onChange={(value) =>
                    onChange({ country: (value as CountryCode || null) ?? undefined })
                }
                clearable
                w={200}
            />
            <Select
                label="Department"
                placeholder="All departments"
                data={[...DEPARTMENTS]}
                value={query.department ?? null}
                onChange={(value) =>
                    onChange({ department: (value as Department || null) ?? undefined })
                }
                clearable
                w={200}
            />
            {hasFilters && (
                <Button
                    variant="subtle"
                    onClick={() => {
                        setSearch('')
                        onChange({ search: undefined, country: undefined, department: undefined });
                    }}
                >
                    Clear filters
                </Button>
            )}
        </Group>
    );
}