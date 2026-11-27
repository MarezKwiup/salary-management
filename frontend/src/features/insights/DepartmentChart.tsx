import { BarChart } from '@mantine/charts';
import type { DepartmentStats } from '../../api/insights';
import type { CountryCode } from '../../lib/countries';
import { formatMoney, formatMoneyCompact } from '../../lib/format';

export function DepartmentChart({
    rows,
    country,
}: {
    rows: DepartmentStats[];
    country: CountryCode;
}) {
    return (
        <BarChart
            h={Math.max(220, rows.length * 44 )}
            data={rows}
            dataKey='department'
            orientation='vertical'
            yAxisProps={{ width: 100 }}
            xAxisProps={{ tickFormatter: (value: number) => formatMoneyCompact(value, country) }}
            series={[{ name: 'totalSalary', label: 'Total salary', color: 'blue.6' }]}
            valueFormatter={(value) => formatMoney(value, country)}
            gridAxis='y'
        />
    )
}