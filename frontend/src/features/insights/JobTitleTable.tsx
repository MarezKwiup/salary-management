import { Table } from '@mantine/core';
import type { JobTitleStats } from '../../api/insights';
import type { CountryCode } from '../../lib/countries';
import { formatMoney } from '../../lib/format';

const numeric = { fontVariantNumeric: 'tabular-nums' } as const;

export function JobTitleTable({ rows, country }: { rows: JobTitleStats[]; country: CountryCode }) {
    return (
        <Table.ScrollContainer minWidth={700}>
            <Table striped highlightOnHover verticalSpacing='xs'>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Job title</Table.Th>
                        <Table.Th ta='right'>Headcount</Table.Th>
                        <Table.Th ta='right'>Median</Table.Th>
                        <Table.Th ta='right'>Average</Table.Th>
                        <Table.Th ta='right'>Lowest</Table.Th>
                        <Table.Th ta='right'>Highest</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.map((row) => (
                        <Table.Tr key={row.jobTitle}>
                            <Table.Td>{row.jobTitle}</Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {row.headcount.toLocaleString()}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric} fw={600}>
                                {formatMoney(row.medianSalary, country)}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatMoney(row.avgSalary, country)}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatMoney(row.minSalary, country)}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatMoney(row.maxSalary, country)}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}