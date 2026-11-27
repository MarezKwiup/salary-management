import { Center, Group, Table, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconSelector } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import type { Employee, EmployeeListQuery, SortBy } from '../api/types';
import { COUNTRIES } from '../lib/countries';
import { formatDate, formatMoney } from '../lib/format';

interface Props {
    employees: Employee[];
    query: EmployeeListQuery;
    onSort: (sortBy: SortBy) => void;
}

export function EmployeesTable({ employees, query, onSort }: Props) {
    const canSortBySalary = Boolean(query.country);

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <SortableHeader column="fullName" query={query} onSort={onSort}>
                            Name
                        </SortableHeader>
                        <Table.Th>Job title</Table.Th>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Country</Table.Th>
                        <SortableHeader
                            column='salary'
                            query={query}
                            onSort={onSort}
                            disabledReason={
                                canSortBySalary
                                    ? undefined
                                    : 'Pick a country to sort by salary'
                            }
                            align='right'   
                        >
                            Salary
                        </SortableHeader>
                        <SortableHeader column='hireDate' query={query} onSort={onSort}>
                            Hire Date
                        </SortableHeader>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {employees.map((employee) => (
                        <Table.Tr key={employee.id}>
                            <Table.Td>{employee.fullName}</Table.Td>
                            <Table.Td>{employee.jobTitle}</Table.Td>
                            <Table.Td>{employee.department}</Table.Td>
                            <Table.Td>
                                {COUNTRIES[employee.country]?.name ?? employee.country}
                            </Table.Td>
                            <Table.Td ta="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatMoney(employee.salary, employee.country)}
                            </Table.Td>
                            <Table.Td>{formatDate(employee.hireDate)}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}

interface SortableHeaderProps {
    column: SortBy;
    query: EmployeeListQuery;
    onSort: (SortBy: SortBy) => void;
    disabledReason?: string | undefined;
    align?: 'left' | 'right';
    children: ReactNode;
}

function SortableHeader({
    column,
    query,
    onSort,
    disabledReason,
    align='left',
    children
}: SortableHeaderProps) {
    const active = query.sortBy === column;
    const Icon = !active ? IconSelector : query.sortOrder === 'asc' ? IconArrowUp : IconArrowDown;

    const button = (
        <UnstyledButton onClick={() => onSort(column)} disabled={Boolean(disabledReason)} w="100%">
            <Group justify={align === 'right' ? 'flex-end' : 'flex-start'} gap={4} wrap='nowrap'>
                <Text fw={600} size='sm' c={disabledReason ? 'dimmed' : undefined}>
                    {children}
                </Text>
                {!disabledReason && (
                    <Center>
                        <Icon size={14} stroke={1.5} />
                    </Center>
                )}
            </Group>

        </UnstyledButton>
    );

    return (
        <Table.Th
            aria-sort={
                active ? (query.sortOrder === 'asc' ? 'ascending' : 'descending') : undefined
            }
        >
            {disabledReason ? <Tooltip label={disabledReason}>{button}</Tooltip> : button}
        </Table.Th>
    );
}
