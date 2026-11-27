import { Anchor, Table, Text, Tooltip } from "@mantine/core";
import { Link } from "react-router";
import type { CountryOverview } from "../../api/insights";
import { COUNTRIES } from "../../lib/countries";
import { formatMoney } from "../../lib/format";
import { averageVsMedian, formatGap } from "../../lib/stats";

const numeric = { fontVariantNumeric: 'tabular-nums' } as const;

export function CountryOverviewTable({ rows }: { rows: CountryOverview[] }) {
    return (
        <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover verticalSpacing='sm'>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Country</Table.Th>
                        <Table.Th ta='right'>Headcount</Table.Th>
                        <Table.Th ta='right'>Median</Table.Th>
                        <Table.Th ta='right'>Average</Table.Th>
                        <Table.Th ta='right'>
                            <Tooltip label="How far the average is above the median. A big gap means a few high earners pull the average up.">
                                <Text span fw={600} size="sm" style={{ cursor: 'help '}}>
                                    Avg vs median
                                </Text>
                            </Tooltip>
                        </Table.Th>
                        <Table.Th ta='right'>Lowest</Table.Th>
                        <Table.Th ta='right'>Highest</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.map((row) => (
                        <Table.Tr key={row.country}>
                            <Table.Td>
                                <Anchor component={Link} to={`/insights/${row.country}`} fw={500}>
                                    {COUNTRIES[row.country]?.name ?? row.country}
                                </Anchor>
                                <Text span c='dimmed' size="xs" ml={6}>
                                    {row.currency}
                                </Text>
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {row.headcount.toLocaleString()}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric} fw={600}>
                                {formatMoney(row.medianSalary, row.country)}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatMoney(row.avgSalary, row.country)}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatGap(averageVsMedian(row.avgSalary, row.medianSalary))}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatMoney(row.minSalary, row.country)}
                            </Table.Td>
                            <Table.Td ta='right' style={numeric}>
                                {formatMoney(row.maxSalary, row.country)}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}