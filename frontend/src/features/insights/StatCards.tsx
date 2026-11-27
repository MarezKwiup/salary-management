import { Paper, SimpleGrid, Text } from "@mantine/core";
import type { SalaryStats } from "../../api/insights";
import type { CountryCode } from "../../lib/countries";
import { formatMoney } from "../../lib/format";
import { averageVsMedian, formatGap } from "../../lib/stats";

interface Props {
    stats: SalaryStats;
    country: CountryCode;
}

export function StatCards({ stats, country }: Props) {
    const gap = averageVsMedian(stats.avgSalary, stats.medianSalary);
    const cards = [
        { label: 'Headcount', value: stats.headcount.toLocaleString() },
        { label: 'Median salary', value: formatMoney(stats.medianSalary, country) },
        {
            label: 'Average salary',
            value: formatMoney(stats.avgSalary, country),
            note: gap === null ? undefined : `${formatGap(gap)} vs median`,
        },
        {
            label: 'Salary range',
            value: `${formatMoney(stats.minSalary, country)} - ${formatMoney(stats.maxSalary, country)}`
        }
    ];

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            {cards.map((card) => (
                <Paper key={card.label} withBorder p='md' radius='md'>
                    <Text size="xs" c='dimmed' tt='uppercase' fw={700}>
                        {card.label}
                    </Text>
                    <Text size="xl" fw={700} mt={4} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {card.value}
                    </Text>
                    {card.note && (
                        <Text size="xs" c='dimmed' mt={2}>
                            {card.note}
                        </Text>
                    )}
                </Paper>
            ))}
        </SimpleGrid>
    );
}