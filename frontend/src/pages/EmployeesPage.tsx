import { Alert, Center, Group, Loader, Pagination, Stack, Text, Title } from "@mantine/core";
import { useEmployees } from "../api/employees";
import type { SortBy } from "../api/types";
import { EmployeeFilters } from "../features/EmployeeFilters";
import { EmployeesTable } from "../features/EmployeesTable";
import { useEmployeeListParams } from "../features/useEmployeeListParams";

export function EmployeesPage() {
    const { query, update } = useEmployeeListParams();
    const { data, isPending, isError, isFetching } = useEmployees(query);

    function handleSort(sortBy: SortBy) {
        const sortOrder = query.sortBy === sortBy && query.sortOrder === 'asc' ? 'desc' : 'asc';
        update({ sortBy, sortOrder });
    }
    
    function handleFilterChange(changes: Parameters<typeof update>[0]) {
        const clearingCountry = 'country' in changes && !changes.country;
        update(
            clearingCountry && query.sortBy === 'salary'
                ? { ...changes, sortBy: undefined, sortOrder: undefined }
                : changes
        );
    }

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={2}>Employees</Title>
                {data && (
                    <Text c="dimmed" size="sm">
                        {data.total.toLocaleString()} {data.total === 1 ? 'employee' : 'employees' }
                    </Text>
                )}
            </Group>

            <EmployeeFilters query={query} onChange={handleFilterChange} />

            {isPending && (
                <Center py='xl'>
                    <Loader />
                </Center>
            )}

            {isError && (
                <Alert color="red" title="Could not load employees">
                    Please check that server is running and try again.
                </Alert>
            )}

            {data && data.data.length === 0 && (
                <Text c='dimmed' ta='center' py='xl'>
                    No employees match these filters.
                </Text>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 150ms' }}>
                        <EmployeesTable employees={data.data} query={query} onSort={handleSort} />
                    </div>
                    <Group justify="center">
                        <Pagination
                            total={data.totalPages}
                            value={query.page}
                            onChange={(page) => update({ page })}
                        />
                    </Group>
                </>
            )}
        </Stack>
    );
}