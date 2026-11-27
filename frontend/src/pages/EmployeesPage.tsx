import { Alert, Button, Center, Group, Loader, Pagination, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEmployees } from "../api/employees";
import { useState } from "react";
import { EmployeeFormModal } from "../features/employees/EmployeeFormModal";
import { useConfirmDelete } from "../features/employees/useConfirmDelete";
import type { SortBy, Employee } from "../api/types";
import { EmployeeFilters } from "../features/employees/EmployeeFilters";
import { EmployeesTable } from "../features/employees/EmployeesTable";
import { useEmployeeListParams } from "../features/employees/useEmployeeListParams";

export function EmployeesPage() {
    const { query, update } = useEmployeeListParams();
    const { data, isPending, isError, isFetching } = useEmployees(query);
    const confirmDelete = useConfirmDelete();

    const [editing, setEditing] = useState<Employee | null | undefined>(undefined);


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
                <div>
                    <Title order={2}>Employees</Title>
                    {data && (
                        <Text c="dimmed" size="sm">
                            {data.total.toLocaleString()} {data.total === 1 ? 'employee' : 'employees' }
                        </Text>
                    )}
                </div>
                <Button leftSection={<IconPlus size={16} />} onClick={() => setEditing(null)}>
                    Add employee
                </Button>
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
                        <EmployeesTable employees={data.data} query={query} onSort={handleSort} onEdit={setEditing} onDelete={confirmDelete}/>
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

            <EmployeeFormModal
                opened={editing !== undefined}
                onClose={() => setEditing(undefined)}
                employee={editing ?? undefined}
            />
        </Stack>
    );
}